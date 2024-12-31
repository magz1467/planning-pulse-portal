import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminControls } from "@/components/AdminControls";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (!adminUser) {
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate]);

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