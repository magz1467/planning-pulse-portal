import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export const AlertSignupLoggedOut = ({ postcode }: { postcode: string }) => {
  return (
    <div className="p-4 bg-primary/5 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Stay informed about new planning applications near {postcode}
      </p>
      <Link to="/auth">
        <Button className="w-full">
          Sign in to get alerts
        </Button>
      </Link>
    </div>
  );
};