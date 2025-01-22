import { useToast } from "@/hooks/use-toast";
import { FeedbackEmailDialog } from "@/components/FeedbackEmailDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApplicationFeedbackSectionProps {
  feedback: 'yimby' | 'nimby' | null;
  feedbackStats: {
    yimbyCount: number;
    nimbyCount: number;
  };
  onFeedback: (type: 'yimby' | 'nimby') => void;
  applicationId: number;
}

export const ApplicationFeedbackSection = ({
  feedback,
  feedbackStats,
  onFeedback,
  applicationId
}: ApplicationFeedbackSectionProps) => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const { toast } = useToast();

  const handleFeedbackEmailSubmit = (email: string) => {
    toast({
      title: "Developer verification pending",
      description: "We'll verify your email and send you access to view all feedback for this application.",
      duration: 5000,
    });
    setShowFeedbackDialog(false);
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Is this your development?</h3>
            <p className="text-sm text-gray-600">Click here to verify and see full feedback</p>
          </div>
          <Button variant="outline" onClick={() => setShowFeedbackDialog(true)}>
            Get feedback
          </Button>
        </div>
      </Card>

      <FeedbackEmailDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSubmit={handleFeedbackEmailSubmit}
      />
    </>
  );
};