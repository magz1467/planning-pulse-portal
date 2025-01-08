import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { ProjectSummary } from "@/components/planning-details/ProjectSummary";

interface FullScreenDetailsProps {
  application: Application;
  onClose: () => void;
  onCommentSubmit: (content: string) => void;
}

export const FullScreenDetails = ({
  application,
  onClose,
}: FullScreenDetailsProps) => {
  return (
    <div className="flex flex-col h-full max-h-[100dvh] overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between p-4">
        <div className="h-4" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 space-y-4">
          <PlanningApplicationDetails
            application={application}
            onClose={onClose}
          />
          {application.application_details && (
            <ProjectSummary applicationDetails={application.application_details} />
          )}
        </div>
      </div>
    </div>
  );
};