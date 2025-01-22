import { Button } from "@/components/ui/button";

interface ApplicationActionsProps {
  applicationId: number;
  onShowPetitionDialog: () => void;
  onShowFeedbackDialog: () => void;
}

export const ApplicationActions = ({
  applicationId,
  onShowPetitionDialog,
  onShowFeedbackDialog,
}: ApplicationActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onShowPetitionDialog} variant="outline">
        Start Petition
      </Button>
      <Button onClick={onShowFeedbackDialog} variant="outline">
        Give Feedback
      </Button>
    </div>
  );
};