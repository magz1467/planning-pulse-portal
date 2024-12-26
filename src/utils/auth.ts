import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const handleAuthChange = (
  event: AuthChangeEvent,
  session: Session | null,
  navigate: NavigateFunction
) => {
  console.log("Auth event:", event);
  console.log("Session:", session);

  const hasValidSession = session && session.user;

  switch (event) {
    case 'SIGNED_IN':
      if (hasValidSession) {
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        });
        navigate("/");
      }
      break;
    case 'SIGNED_OUT':
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/auth");
      break;
    case 'USER_UPDATED':
      if (hasValidSession) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
      break;
    case 'PASSWORD_RECOVERY':
      toast({
        title: "Password recovery",
        description: "Check your email for the password recovery link",
      });
      break;
    case 'INITIAL_SESSION':
      if (hasValidSession) {
        console.log('Initial session detected with valid user');
        navigate("/auth/success");
      } else {
        console.log('No valid session detected');
      }
      break;
  }
};

export const checkSession = async (
  navigate: NavigateFunction,
  showToast = true
) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Checking session:', session, 'Error:', error);
    
    if (error) throw error;
    
    if (session?.user) {
      if (showToast) {
        toast({
          title: "Already signed in",
          description: "You are already signed in",
        });
      }
      navigate("/");
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Session check error:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};