import { Application } from "@/types/planning";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationDialogsProps {
  application: Application;
  showPetitionDialog: boolean;
  setShowPetitionDialog: (show: boolean) => void;
  showFeedbackDialog: boolean;
  setShowFeedbackDialog: (show: boolean) => void;
}

export const ApplicationDialogs = ({
  application,
  showPetitionDialog,
  setShowPetitionDialog,
  showFeedbackDialog,
  setShowFeedbackDialog,
}: ApplicationDialogsProps) => {
  const [petitionReason, setPetitionReason] = useState("");
  const { toast } = useToast();

  const handlePetitionSubmit = () => {
    toast({
      title: "Petition Started",
      description: "Your petition has been created successfully.",
      duration: 5000,
    });
    setShowPetitionDialog(false);
  };

  const handleFeedbackSubmit = (type: 'support' | 'oppose') => {
    toast({
      title: "Feedback Submitted",
      description: `Your ${type} feedback has been recorded.`,
      duration: 5000,
    });
    setShowFeedbackDialog(false);
  };

  return (
    <>
      <Dialog open={showPetitionDialog} onOpenChange={setShowPetitionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a Petition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={petitionReason}
              onChange={(e) => setPetitionReason(e.target.value)}
              placeholder="Why are you starting this petition?"
              className="w-full h-32 p-2 border rounded-md"
            />
            <Button onClick={handlePetitionSubmit}>Submit Petition</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give Your Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Do you support or oppose this application?</p>
            <div className="flex gap-4">
              <Button onClick={() => handleFeedbackSubmit('support')} variant="outline">
                Support
              </Button>
              <Button onClick={() => handleFeedbackSubmit('oppose')} variant="outline">
                Oppose
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};