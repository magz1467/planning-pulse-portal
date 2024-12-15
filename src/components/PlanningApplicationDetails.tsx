import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { ApplicationDetails } from "./planning-details/ApplicationDetails";
import { ApplicationDescription } from "./planning-details/ApplicationDescription";
import { ApplicationComments } from "./planning-details/ApplicationComments";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  return (
    <div className="p-6 animate-slide-up">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={onClose}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to list
      </Button>

      <div className="space-y-6">
        <ApplicationHeader application={application} />
        <ApplicationImage application={application} />
        <ApplicationDetails application={application} />
        <ApplicationDescription application={application} />
        <ApplicationComments />
      </div>
    </div>
  );
};