import { EmailDialog } from "@/components/EmailDialog";
import { FeedbackEmailDialog } from "@/components/FeedbackEmailDialog";
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog";

interface ApplicationDialogsProps {
  showEmailDialog: boolean;
  showFeedbackDialog: boolean;
  showAuthDialog: boolean;
  onEmailDialogChange: (open: boolean) => void;
  onFeedbackDialogChange: (open: boolean) => void;
  onAuthDialogChange: (open: boolean) => void;
  onEmailSubmit: (radius: string) => void;
  onFeedbackEmailSubmit: (email: string) => void;
  postcode: string;
}

export const ApplicationDialogs = ({
  showEmailDialog,
  showFeedbackDialog,
  showAuthDialog,
  onEmailDialogChange,
  onFeedbackDialogChange,
  onAuthDialogChange,
  onEmailSubmit,
  onFeedbackEmailSubmit,
  postcode
}: ApplicationDialogsProps) => {
  return (
    <>
      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={onEmailDialogChange}
        onSubmit={onEmailSubmit}
        postcode={postcode}
      />

      <FeedbackEmailDialog
        open={showFeedbackDialog}
        onOpenChange={onFeedbackDialogChange}
        onSubmit={onFeedbackEmailSubmit}
      />

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={onAuthDialogChange}
      />
    </>
  );
};