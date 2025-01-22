import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { ApplicationMetadata } from "./ApplicationMetadata";
import { ApplicationActions } from "./ApplicationActions";
import { ApplicationContent } from "./ApplicationContent";
import { EmailDialog } from "@/components/EmailDialog";
import { ApplicationDialogs } from "./ApplicationDialogs";

interface PlanningApplicationDetailsProps {
  application: Application;
  onDismiss?: () => void;
}

export const PlanningApplicationDetails = ({
  application: initialApplication,
  onDismiss
}: PlanningApplicationDetailsProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(initialApplication);
  const [showPetitionDialog, setShowPetitionDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  useEffect(() => {
    setCurrentApplication(initialApplication);
  }, [initialApplication]);

  const handleEmailSubmit = (content: string) => {
    console.log("New email:", content);
    // Handle email submission logic
  };

  return (
    <div className="p-6 space-y-4 pb-20">
      <ApplicationMetadata 
        application={currentApplication}
        onShowEmailDialog={() => setShowEmailDialog(true)}
      />
      
      <ApplicationActions 
        applicationId={currentApplication.id}
        onShowPetitionDialog={() => setShowPetitionDialog(true)}
        onShowFeedbackDialog={() => setShowFeedbackDialog(true)}
      />

      <ApplicationContent application={currentApplication} />

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={currentApplication.postcode || ''}
      />

      <ApplicationDialogs
        application={currentApplication}
        showPetitionDialog={showPetitionDialog}
        setShowPetitionDialog={setShowPetitionDialog}
        showFeedbackDialog={showFeedbackDialog}
        setShowFeedbackDialog={setShowFeedbackDialog}
      />

      {onDismiss && (
        <button onClick={onDismiss} className="mt-4 text-blue-500">
          Dismiss
        </button>
      )}
    </div>
  );
};
