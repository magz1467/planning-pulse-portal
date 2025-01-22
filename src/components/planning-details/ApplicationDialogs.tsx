import { EmailDialog } from "@/components/EmailDialog";
import { FeedbackEmailDialog } from "@/components/FeedbackEmailDialog";
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog";

interface ApplicationDialogsProps {
  showEmailDialog: boolean;
  setShowEmailDialog: (show: boolean) => void;
  showFeedbackDialog: boolean;
  setShowFeedbackDialog: (show: boolean) => void;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  onEmailSubmit: (radius: string) => void;
  onFeedbackEmailSubmit: (email: string) => void;
  postcode?: string;
}

export const ApplicationDialogs = ({
  showEmailDialog,
  setShowEmailDialog,
  showFeedbackDialog,
  setShowFeedbackDialog,
  showAuthDialog,
  setShowAuthDialog,
  onEmailSubmit,
  onFeedbackEmailSubmit,
  postcode
}: ApplicationDialogsProps) => {
  return (
    <>
      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={onEmailSubmit}
        postcode={postcode || ''}
      />

      <FeedbackEmailDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSubmit={onFeedbackEmailSubmit}
      />

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};