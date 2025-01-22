import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { ApplicationMetadata } from "./planning-details/ApplicationMetadata";
import { ApplicationActions } from "./planning-details/ApplicationActions";
import { ApplicationContent } from "./planning-details/ApplicationContent";
import { EmailDialog } from "@/components/EmailDialog";
import { ApplicationDialogs } from "./planning-details/ApplicationDialogs";
import { X } from "lucide-react";

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
    <div className="p-6 space-y-4 pb-20 relative">
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close details"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
      
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
    </div>
  );
};