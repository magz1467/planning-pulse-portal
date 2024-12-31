import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NavigationMenu = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link to="/resident-services" className="text-gray-600 hover:text-primary">
        Resident Services
      </Link>
      <Link to="/developer-services" className="text-gray-600 hover:text-primary">
        Developer Services
      </Link>
      <Link to="/council-services" className="text-gray-600 hover:text-primary">
        Council Services
      </Link>
      <Link to="/about" className="text-gray-600 hover:text-primary">
        About
      </Link>
      <Link to="/contact" className="text-gray-600 hover:text-primary">
        Contact
      </Link>
      {isAdmin && (
        <Link to="/admin" className="text-gray-600 hover:text-primary">
          Admin
        </Link>
      )}
    </nav>
  );
};