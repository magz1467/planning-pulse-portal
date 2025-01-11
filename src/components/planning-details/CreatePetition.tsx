import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PetitionForm } from "./PetitionForm";
import { PetitionReasons } from "./petition/PetitionReasons";

interface CreatePetitionProps {
  applicationId: number;
}

export const CreatePetition = ({ applicationId }: CreatePetitionProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [showPetitionForm, setShowPetitionForm] = useState(false);

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(current =>
      current.includes(reasonId)
        ? current.filter(id => id !== reasonId)
        : [...current, reasonId]
    );
  };

  return (
    <Card className="p-4 border-2 border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between group hover:bg-primary/5"
        onClick={() => setShowPetitionForm(true)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-primary">Create Petition</h3>
            <p className="text-sm text-gray-600">Rally support from residents</p>
          </div>
        </div>
        <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Start now →
        </span>
      </Button>

      <PetitionForm
        open={showPetitionForm}
        onOpenChange={setShowPetitionForm}
        applicationId={applicationId}
        selectedReasons={selectedReasons}
      />
    </Card>
  );
};