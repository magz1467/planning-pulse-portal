import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";
import { PetitionForm } from "./PetitionForm";

const PETITION_REASONS = [
  { id: "privacy", label: "Loss of privacy" },
  { id: "light", label: "Loss of light" },
  { id: "parking", label: "Car parking" },
  { id: "traffic", label: "Traffic generation" },
  { id: "noise", label: "Noise and disturbance" },
  { id: "character", label: "Character of the area" },
  { id: "greenbelt", label: "Green belt" },
  { id: "conservation", label: "Conservation area" },
  { id: "design", label: "Design, appearance and layout" },
  { id: "policies", label: "National and local policies" },
  { id: "other", label: "Other" },
];

interface CreatePetitionProps {
  applicationId: number;
}

export const CreatePetition = ({ applicationId }: CreatePetitionProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPetitionForm, setShowPetitionForm] = useState(false);

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(current =>
      current.includes(reasonId)
        ? current.filter(id => id !== reasonId)
        : [...current, reasonId]
    );
  };

  return (
    <Card className="p-4 border-2 border-primary/20 shadow-lg animate-fade-in hover:border-primary/40 transition-colors duration-300">
      <div className="bg-primary/5 -m-4 mb-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg text-primary">Create a Petition</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Start a petition to gather support from other residents
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Hide reasons" : "Select reasons for petition"}
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {PETITION_REASONS.map((reason) => (
            <div key={reason.id} className="flex items-center space-x-2">
              <Checkbox
                id={reason.id}
                checked={selectedReasons.includes(reason.id)}
                onCheckedChange={() => handleReasonToggle(reason.id)}
              />
              <label
                htmlFor={reason.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {reason.label}
              </label>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4"
            disabled={selectedReasons.length === 0}
            onClick={() => setShowPetitionForm(true)}
          >
            Create Petition
          </Button>
        </div>
      )}

      <PetitionForm
        open={showPetitionForm}
        onOpenChange={setShowPetitionForm}
        applicationId={applicationId}
        selectedReasons={selectedReasons}
      />
    </Card>
  );
};