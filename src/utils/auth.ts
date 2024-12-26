import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const handleAuthStateChange = (
  event: AuthChangeEvent, 
  session: Session | null,
  navigate: (path: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  console.log('Auth state changed:', event, 'Session:', session);
  
  switch (event) {
    case 'SIGNED_IN':
      if (session) {
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
      if (session) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
      break;
    case 'PASSWORD_RECOVERY':
      toast({
        title: "Password recovery",
        description: "Check your email for the recovery link",
      });
      break;
    case 'INITIAL_SESSION':
      if (session) {
        console.log('Initial session detected, redirecting to success page');
        navigate("/auth/success");
      }
      break;
  }
};

export const checkSession = async (
  navigate: (path: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Checking session:', session, 'Error:', error);
    
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