import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface FullScreenDetailsProps {
  application: Application;
  onClose: () => void;
}

export const FullScreenDetails = ({
  application,
  onClose,
}: FullScreenDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <PlanningApplicationDetails
        application={application}
        onClose={onClose}
      />
    </div>
  );
};