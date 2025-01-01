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
      <div className="bg-primary/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Stay informed about new planning applications near {postcode}
        </p>
        {session ? (
          <Button 
            className="w-full"
            onClick={onShowEmailDialog}
          >
            Get Alerts
          </Button>
        ) : (
          <Link 
            to="/auth" 
            className="w-full"
            state={{ from: location.pathname, postcode: postcode }}
          >
            <Button className="w-full">
              Sign in to get alerts
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};