import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface ApplicationDetailViewProps {
  application: Application;
  onDismiss: () => void;
}

export const ApplicationDetailView = ({
  application,
  onDismiss,
}: ApplicationDetailViewProps) => {
  return (
    <div className="h-full overflow-auto">
      <PlanningApplicationDetails
        application={application}
        onDismiss={onDismiss}
      />
    </div>
  );
};