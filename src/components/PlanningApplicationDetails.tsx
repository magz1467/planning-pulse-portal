import { Application } from "@/types/planning";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { ProjectSummary } from "./planning-details/ProjectSummary";
import { DetailsSections } from "./planning-details/DetailsSections";
import { ApplicationFeedback } from "./planning-details/ApplicationFeedback";
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
    <div className="flex flex-col space-y-4 p-4">
      <ApplicationHeader application={application} onClose={onClose} />
      <ApplicationImage application={application} />
      <ProjectSummary application={application} />
      <DetailsSections application={application} />
      <ApplicationFeedback application={application} />
      <ApplicationComments applicationId={application.id} />
    </div>
  );
};