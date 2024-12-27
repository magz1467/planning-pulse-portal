import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { handleAuthChange } from "@/utils/auth";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out",
        });
      } else if (event === 'USER_DELETED') {
        toast({
          title: "Account deleted",
          description: "Your account has been deleted",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password recovery email sent",
          description: "Check your email for the recovery link",
        });
      }
    });

    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Checking session:', session, 'Error:', error);
        
        if (error) {
          console.error('Session check error:', error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (session?.user) {
          toast({
            title: "Already signed in",
            description: "You are already signed in",
          });
          navigate("/");
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        let errorMessage = 'An unexpected error occurred';
        
        // Handle specific error cases
        if (error.message?.includes('Invalid API key')) {
          errorMessage = 'Authentication service configuration error. Please try again later.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before signing in';
        } else if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message?.includes('Email already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead';
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow" role="dialog" aria-labelledby="auth-title">
          <div>
            <h2 id="auth-title" className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {mode === 'signup' 
                ? 'Sign up to start tracking planning applications'
                : 'Sign in to your account'}
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: 'rgb(var(--primary))', color: 'white' },
                anchor: { color: 'rgb(var(--primary))' },
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
            onError={(error) => {
              console.error('Auth error:', error);
              let errorMessage = error.message;
              
              // Map specific error messages to user-friendly ones
              if (error.message?.includes('Invalid API key')) {
                errorMessage = 'Authentication service configuration error. Please try again later.';
              } else if (error.message?.includes('Email not confirmed')) {
                errorMessage = 'Please confirm your email address before signing in';
              } else if (error.message?.includes('Invalid login credentials')) {
                errorMessage = 'Invalid email or password';
              } else if (error.message?.includes('Email already registered')) {
                errorMessage = 'This email is already registered. Please sign in instead';
              }

              toast({
                title: "Authentication Error",
                description: errorMessage,
                variant: "destructive"
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;