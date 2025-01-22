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
    <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom duration-300">
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto">
          <PlanningApplicationDetails
            application={application}
            onDismiss={onDismiss}
          />
        </div>
      </div>
    </div>
  );
};