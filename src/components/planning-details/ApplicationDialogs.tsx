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
  const [petitionTitle, setPetitionTitle] = useState("");
  const [petitionDescription, setPetitionDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handlePetitionSubmit = () => {
    if (!petitionTitle || !petitionDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Petition Created",
      description: "Your petition has been submitted for review",
    });
    setPetitionTitle("");
    setPetitionDescription("");
    setShowPetitionDialog(false);
  };

  const handleFeedbackSubmit = () => {
    if (!feedback) {
      toast({
        title: "Missing Feedback",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback",
    });
    setFeedback("");
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
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Petition Title
              </label>
              <input
                type="text"
                id="title"
                value={petitionTitle}
                onChange={(e) => setPetitionTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={petitionDescription}
                onChange={(e) => setPetitionDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <Button onClick={handlePetitionSubmit} className="w-full">
              Create Petition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <Button onClick={handleFeedbackSubmit} className="w-full">
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};