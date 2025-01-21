import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AlertSectionProps {
  postcode: string;
  onShowEmailDialog: () => void;
}

export const AlertSection = ({ postcode, onShowEmailDialog }: AlertSectionProps) => {
  const [session, setSession] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center justify-between p-3 bg-[#f6c8cc]/5 rounded-lg">
        <div className="flex items-center gap-2">
          <Bell className="text-[#f6c8cc]" size={16} />
          <h3 className="font-playfair text-[#f6c8cc]">Your Feed</h3>
        </div>
        {session ? (
          <Button 
            size="sm"
            className="h-8"
            onClick={onShowEmailDialog}
          >
            <Bell className="h-4 w-4" />
          </Button>
        ) : (
          <Link 
            to="/auth" 
            state={{ from: location.pathname, postcode: postcode }}
          >
            <Button size="sm" className="h-8">
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};