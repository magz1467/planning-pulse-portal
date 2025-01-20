import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetitionReasons } from "./petition/PetitionReasons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PetitionSharing } from "./petition/PetitionSharing";
import Image from "@/components/ui/image";

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
          <h3 className="font-playfair text-2xl text-primary font-bold">Create Petition</h3>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">📝</span>
              <p className="text-sm text-gray-600">Instant petition creation to challenge applications</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">🌟</span>
              <p className="text-sm text-gray-600">Easy share with your local network</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">📨</span>
              <p className="text-sm text-gray-600">Template ready for you to send to the council</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <Image
            src="/lovable-uploads/44747e06-e179-40ce-9a85-66748ee50961.png"
            alt="Create a petition illustration"
            width={400}
            height={400}
            className="rounded-full shadow-md max-w-full h-auto"
          />
        </div>
      </div>

      <Button
        variant="default"
        className="w-full mt-8 bg-secondary hover:bg-secondary/90 text-white py-6 text-lg font-semibold"
        onClick={() => setShowReasons(true)}
      >
        Start Your Petition →
      </Button>

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