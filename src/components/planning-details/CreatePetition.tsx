import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PetitionForm } from "./PetitionForm";
import { PetitionReasons } from "./petition/PetitionReasons";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CreatePetitionProps {
  applicationId: number;
}

export const CreatePetition = ({ applicationId }: CreatePetitionProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [showPetitionForm, setShowPetitionForm] = useState(false);
  const [showReasons, setShowReasons] = useState(false);

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
      setShowPetitionForm(true);
    }
  };

  return (
    <Card className="p-4 border-2 border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300">
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
        <div className="flex-shrink-0">
          <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Start →
          </span>
        </div>
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

      <PetitionForm
        open={showPetitionForm}
        onOpenChange={setShowPetitionForm}
        applicationId={applicationId}
        selectedReasons={selectedReasons}
      />
    </Card>
  );
};