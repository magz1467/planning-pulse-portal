import { Application } from "@/types/planning";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useApplicationFeedback } from "@/hooks/use-application-feedback";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ApplicationMetadata } from "./planning-details/ApplicationMetadata";
import { ApplicationActions } from "./planning-details/ApplicationActions";
import { ApplicationContent } from "./planning-details/ApplicationContent";
import { ApplicationDialogs } from "./planning-details/ApplicationDialogs";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const emailDialog = useDialogState(false);
  const feedbackDialog = useDialogState(false);
  const authDialog = useDialogState(false);
  const { feedback, handleFeedback } = useApplicationFeedback();
  const { toast } = useToast();
  const { savedApplications, toggleSavedApplication } = useSavedApplications();

  useEffect(() => {
    console.log('PlanningApplicationDetails - Application Data:', {
      id: application?.id,
      class_3: application?.class_3,
      title: application?.title
    });
    
    return () => {
      emailDialog.close();
      feedbackDialog.close();
      authDialog.close();
      document.body.style.overflow = '';
    };
  }, [application]);

  if (!application) return null;

  const isSaved = savedApplications.includes(application.id);

  const feedbackStats = {
    thumbsUp: feedback === 'up' ? 13 : 12,
    thumbsDown: feedback === 'down' ? 4 : 3
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      authDialog.open();
      return;
    }

    toggleSavedApplication(application.id);
    toast({
      title: isSaved ? "Application removed" : "Application saved",
      description: isSaved 
        ? "The application has been removed from your saved list" 
        : "The application has been added to your saved list. View all your saved applications.",
      action: !isSaved ? (
        <Link to="/saved" className="text-primary hover:underline">
          View saved
        </Link>
      ) : undefined
    });
  };

  const handleEmailSubmit = (radius: string) => {
    toast({
      title: "Notification setup",
      description: `We'll notify you when a decision is made on this application.`,
      duration: 5000,
    });
    emailDialog.close();
  };

  const handleFeedbackEmailSubmit = (email: string) => {
    toast({
      title: "Developer verification pending",
      description: "We'll verify your email and send you access to view all feedback for this application.",
      duration: 5000,
    });
    feedbackDialog.close();
  };

  return (
    <div className="p-6 space-y-4 pb-20">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <ApplicationMetadata 
            application={application}
            onShowEmailDialog={emailDialog.open}
          />
        </div>
      </div>
      
      <ApplicationActions 
        applicationId={application.id}
        reference={application.reference}
        isSaved={isSaved}
        onSave={handleSave}
        onShowEmailDialog={emailDialog.open}
      />

      <ApplicationContent 
        application={application}
        feedback={feedback}
        feedbackStats={feedbackStats}
        onFeedback={handleFeedback}
      />

      <ApplicationDialogs
        showEmailDialog={emailDialog.isOpen}
        showFeedbackDialog={feedbackDialog.isOpen}
        showAuthDialog={authDialog.isOpen}
        onEmailDialogChange={emailDialog.close}
        onFeedbackDialogChange={feedbackDialog.close}
        onAuthDialogChange={authDialog.close}
        onEmailSubmit={handleEmailSubmit}
        onFeedbackEmailSubmit={handleFeedbackEmailSubmit}
        postcode={application?.postcode || ''}
      />
    </div>
  );
};