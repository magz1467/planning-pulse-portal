import { Application } from "@/types/planning";
import { ApplicationHeader } from "./ApplicationHeader";
import { ApplicationImage } from "./ApplicationImage";
import { ProjectSummary } from "./ProjectSummary";
import { DetailsSections } from "./DetailsSections";
import { ApplicationFeedback } from "./ApplicationFeedback";
import { ApplicationComments } from "./ApplicationComments";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <ApplicationHeader application={application} onClose={onClose} />
      <ApplicationImage application={application} />
      <ProjectSummary applicationDetails={application.application_details} />
      <DetailsSections application={application} />
      <ApplicationFeedback application={application} />
      <ApplicationComments application={application} />
    </div>
  );
};
