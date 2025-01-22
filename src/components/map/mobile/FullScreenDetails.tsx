import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface FullScreenDetailsProps {
  application: Application;
  onClose: () => void;
}

export const FullScreenDetails = ({
  application,
  onClose,
}: FullScreenDetailsProps) => {
  return (
    <div className="flex flex-col h-full max-h-[100dvh] overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <PlanningApplicationDetails
          application={application}
          onClose={onClose}
        />
      </div>
    </div>
  );
};