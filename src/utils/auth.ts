import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { NavigateFunction } from "react-router-dom";

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