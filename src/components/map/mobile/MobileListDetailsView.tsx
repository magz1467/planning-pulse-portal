import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface MobileListDetailsViewProps {
  application: Application;
  onDismiss: () => void;
}

export const MobileListDetailsView = ({
  application,
  onDismiss,
}: MobileListDetailsViewProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <PlanningApplicationDetails
          application={application}
          onDismiss={onDismiss}
        />
      </div>
    </div>
  );
};