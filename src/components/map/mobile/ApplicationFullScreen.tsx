import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface ApplicationFullScreenProps {
  application: Application;
  onDismiss: () => void;
}

export const ApplicationFullScreen = ({
  application,
  onDismiss,
}: ApplicationFullScreenProps) => {
  return (
    <div className="fixed inset-0 bg-white z-[2000] overflow-auto">
      <PlanningApplicationDetails
        application={application}
        onDismiss={onDismiss}
      />
    </div>
  );
};