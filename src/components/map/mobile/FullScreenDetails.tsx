import { Application } from "@/types/planning";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface FullScreenDetailsProps {
  application: Application;
  onDismiss: () => void;
  onCommentSubmit: (content: string) => void;
}

export const FullScreenDetails = ({
  application,
  onDismiss,
  onCommentSubmit,
}: FullScreenDetailsProps) => {
  return (
    <div className="relative h-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-50"
        onClick={onDismiss}
      >
        <X className="h-6 w-6" />
      </Button>
      <PlanningApplicationDetails 
        application={application}
        onClose={onDismiss}
      />
    </div>
  );
};