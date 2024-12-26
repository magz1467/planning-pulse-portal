import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const handleAuthStateChange = (
  event: AuthChangeEvent, 
  session: Session | null,
  navigate: (path: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  switch (event) {
    case 'SIGNED_IN':
      toast({
        title: "Success",
        description: "You have been signed in successfully",
      });
      navigate("/");
      break;
    case 'SIGNED_OUT':
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/auth");
      break;
    case 'USER_UPDATED':
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      break;
    case 'PASSWORD_RECOVERY':
      toast({
        title: "Password recovery",
        description: "Check your email for the recovery link",
      });
      break;
    case 'INITIAL_SESSION':
      // User has an active session
      navigate("/auth/success");
      break;
  }
};

export const checkSession = async (
  navigate: (path: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (session) {
      toast({
        title: "Already signed in",
        description: "You are already signed in",
      });
      navigate("/");
    }
  } catch (error: any) {
    console.error('Session check error:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
};