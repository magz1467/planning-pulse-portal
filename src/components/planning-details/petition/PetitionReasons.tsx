import { Checkbox } from "@/components/ui/checkbox";
import { PETITION_REASONS } from "@/types/petition";

interface PetitionReasonsProps {
  selectedReasons: string[];
  onReasonToggle: (reasonId: string) => void;
}

export const PetitionReasons = ({ selectedReasons, onReasonToggle }: PetitionReasonsProps) => {
  return (
    <div className="mt-4 space-y-3">
      {PETITION_REASONS.map((reason) => (
        <div key={reason.id} className="flex items-center space-x-2">
          <Checkbox
            id={reason.id}
            checked={selectedReasons.includes(reason.id)}
            onCheckedChange={() => onReasonToggle(reason.id)}
          />
          <label
            htmlFor={reason.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {reason.label}
          </label>
        </div>
      ))}
    </div>
  );
};