interface ApplicationActionsProps {
  applicationId: number;
  onShowPetitionDialog: () => void;
  onShowFeedbackDialog: () => void;
}

export const ApplicationActions = ({
  applicationId,
  onShowPetitionDialog,
  onShowFeedbackDialog
}: ApplicationActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onShowPetitionDialog} className="text-sm text-gray-600 hover:text-gray-900">
        Start Petition
      </button>
      <button onClick={onShowFeedbackDialog} className="text-sm text-gray-600 hover:text-gray-900">
        Give Feedback
      </button>
    </div>
  );
};