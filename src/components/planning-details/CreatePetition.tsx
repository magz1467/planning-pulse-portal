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
    <Card className="p-4 border-2 border-primary/20 shadow-lg hover:border-primary/40 transition-colors duration-300">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between group"
        onClick={() => setShowPetitionForm(true)}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div className="text-left">
            <h3 className="font-semibold text-lg text-primary">Create a Petition</h3>
            <p className="text-sm text-gray-600">Start a petition to gather support from other residents</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary text-sm">
          Click to start →
        </div>
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