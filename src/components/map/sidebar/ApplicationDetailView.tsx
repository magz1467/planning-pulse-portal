import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { ProjectSummary } from "@/components/planning-details/ProjectSummary";

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationDetailView = ({
  application,
  onClose,
}: ApplicationDetailViewProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <PlanningApplicationDetails
          application={application}
          onClose={onClose}
        />
        {application.application_details && (
          <ProjectSummary applicationDetails={application.application_details} />
        )}
      </div>
    </div>
  );
};