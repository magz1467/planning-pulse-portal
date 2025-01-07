import { Button } from "@/components/ui/button";
import { Bell, Heart, BookmarkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActionButtonsProps {
  applicationId: number;
  isSaved?: boolean;
}

export const ActionButtons = ({ applicationId, isSaved }: ActionButtonsProps) => {
  const { toast } = useToast();
  const { addSavedApplication, removeSavedApplication } = useSavedApplications();

  const handleSaveToggle = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save applications",
      });
      return;
    }

    if (isSaved) {
      await removeSavedApplication(applicationId);
      toast({
        title: "Application removed",
        description: "Application removed from saved list",
      });
    } else {
      await addSavedApplication(applicationId);
      toast({
        title: "Application saved",
        description: "Application added to saved list",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Get Updates</h3>
        <p className="text-sm text-gray-500 mb-4">
          Receive notifications about changes to this application
        </p>
        <Button className="w-full" variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Follow Application
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Save Application</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add this application to your saved list
        </p>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleSaveToggle}
        >
          {isSaved ? (
            <Heart className="w-4 h-4 mr-2 fill-current" />
          ) : (
            <BookmarkIcon className="w-4 h-4 mr-2" />
          )}
          {isSaved ? 'Saved' : 'Save Application'}
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Share Feedback</h3>
        <p className="text-sm text-gray-500 mb-4">
          Submit your comments on this application
        </p>
        <Link to={`/applications/${applicationId}/feedback`} className="w-full">
          <Button className="w-full" variant="outline">
            Submit Feedback
          </Button>
        </Link>
      </Card>
    </div>
  );
};