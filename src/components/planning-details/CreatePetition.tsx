import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetitionReasons } from "./petition/PetitionReasons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PetitionSharing } from "./petition/PetitionSharing";
import { PetitionHeader } from "./petition/PetitionHeader";
import { PetitionFeatures } from "./petition/PetitionFeatures";
import { PetitionImage } from "./petition/PetitionImage";
import { PetitionButton } from "./petition/PetitionButton";

interface CreatePetitionProps {
  applicationId: number;
}

export const CreatePetition = ({ applicationId }: CreatePetitionProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [showReasons, setShowReasons] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(current =>
      current.includes(reasonId)
        ? current.filter(id => id !== reasonId)
        : [...current, reasonId]
    );
  };

  const handleContinue = () => {
    if (selectedReasons.length > 0) {
      setShowReasons(false);
      setShowSuccess(true);
    }
  };

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <PetitionHeader />
          <PetitionFeatures />
        </div>
        <PetitionImage />
      </div>

      <PetitionButton onClick={() => setShowReasons(true)} />

      <Dialog open={showReasons} onOpenChange={setShowReasons}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Reasons for Petition</h2>
            <PetitionReasons
              selectedReasons={selectedReasons}
              onReasonToggle={handleReasonToggle}
            />
            <Button 
              className="w-full mt-4" 
              onClick={handleContinue}
              disabled={selectedReasons.length === 0}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Petition Created Successfully! 🎉</h2>
            <p className="text-sm text-gray-600">
              Thank you for creating this petition! Share it with others to increase its impact.
            </p>
            <PetitionSharing applicationId={applicationId} />
            <Button onClick={() => setShowSuccess(false)} className="w-full mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};