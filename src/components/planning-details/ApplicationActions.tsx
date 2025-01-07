import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import { ApplicationSharing } from "./ApplicationSharing";
import { useState } from "react";
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationActionsProps {
  application: Application;
}

export const ApplicationActions = ({ application }: ApplicationActionsProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { savedApplications, toggleSavedApplication } = useSavedApplications();
  const { toast } = useToast();
  const isSaved = savedApplications.includes(application.application_id);

  const handleSaveClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      await toggleSavedApplication(application.application_id);
      toast({
        title: isSaved ? "Application removed" : "Application saved",
        description: isSaved
          ? "The application has been removed from your saved list"
          : "The application has been added to your saved list",
      });
    } catch (error) {
      console.error('Error toggling saved application:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => setShowShareDialog(true)}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={handleSaveClick}
      >
        <Heart
          className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
        />
        {isSaved ? "Saved" : "Save"}
      </Button>
      <ApplicationSharing
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        application={application}
      />
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};