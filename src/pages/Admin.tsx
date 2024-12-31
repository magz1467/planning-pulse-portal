import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminControls } from "@/components/AdminControls";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Access Denied",
            description: "Please sign in to access this page",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (error || !adminUser) {
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        toast({
          title: "Error",
          description: "An error occurred while checking admin access",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminControls />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Admin;