import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    const checkSession = async () => {
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

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        }
        if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password recovery",
            description: "Check your email for the recovery link",
          });
        }
        if (event === 'SIGNED_IN') {
          toast({
            title: "Success",
            description: "You have been signed in successfully",
            variant: "default",
          });
          navigate("/");
        }
        if (event === 'USER_UPDATED') {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully",
          });
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
            redirectTo={window.location.origin + '/auth/callback'}
            onError={(error) => {
              console.error('Auth error:', error);
              toast({
                title: "Authentication Error",
                description: error.message,
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