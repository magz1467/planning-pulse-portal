import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationDetailView = ({
  application,
  onClose,
}: ApplicationDetailViewProps) => {
  return (
    <div className="h-full overflow-auto">
      <PlanningApplicationDetails
        application={application}
        onClose={onClose}
      />
    </div>
  );
};