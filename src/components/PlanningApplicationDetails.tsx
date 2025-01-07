import { Application } from "@/types/planning";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationActions } from "./planning-details/ApplicationActions";
import { ApplicationContent } from "./planning-details/ApplicationContent";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose?: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  if (!application) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ApplicationHeader application={application} />
      <ApplicationActions application={application} />
      <ApplicationContent application={application} onClose={onClose} />
    </div>
  );
};