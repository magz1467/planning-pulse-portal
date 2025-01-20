import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Share, FileCheck } from "lucide-react";
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
    <Card className="p-4 border-2 border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between group hover:bg-primary/5"
            onClick={() => setShowReasons(true)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-primary">Create Petition</h3>
                <p className="text-sm text-gray-600">Rally support</p>
              </div>
            </div>
            <span className="text-primary text-sm font-medium">
              Start →
            </span>
          </Button>

          <div className="space-y-4 pl-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">Instant petition creation to challenge applications</p>
            </div>
            <div className="flex items-start gap-3">
              <Share className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">Easy share with your local network</p>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">Template ready for you to send to the council</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/lovable-uploads/44747e06-e179-40ce-9a85-66748ee50961.png"
            alt="Create a petition illustration"
            width={400}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

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