import { EmailDialog } from "@/components/EmailDialog";
import { useToast } from "@/hooks/use-toast";

interface EmailDialogWrapperProps {
  showEmailDialog: boolean;
  setShowEmailDialog: (show: boolean) => void;
  postcode: string;
}

export const EmailDialogWrapper = ({
  showEmailDialog,
  setShowEmailDialog,
  postcode,
}: EmailDialogWrapperProps) => {
  const { toast } = useToast();

  const handleEmailSubmit = (radius: string) => {
    const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
    toast({
      title: "Subscription pending",
      description: `We've sent a confirmation email to your registered email. Please check your inbox and click the link to confirm your subscription for planning alerts within ${radiusText} of ${postcode}. The email might take a few minutes to arrive.`,
      duration: 5000,
    });
  };

  return (
    <EmailDialog 
      open={showEmailDialog}
      onOpenChange={setShowEmailDialog}
      onSubmit={handleEmailSubmit}
      postcode={postcode}
    />
  );
};