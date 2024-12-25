import { Application } from "@/types/planning";
import { MobileListView } from "./MobileListView";
import { MobileDetailsView } from "./MobileDetailsView";

interface MobileListContainerProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  onSelectApplication: (id: number) => void;
  onShowEmailDialog: () => void;
}

export const MobileListContainer = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
}: MobileListContainerProps) => {
  const selectedApp = applications.find(app => app.id === selectedApplication);

  return (
    <div className="flex-1 overflow-hidden">
      {selectedApplication !== null && selectedApp ? (
        <MobileDetailsView
          application={selectedApp}
          onClose={() => onSelectApplication(null)}
        />
      ) : (
        <MobileListView
          postcode={postcode}
          applications={applications}
          onSelectApplication={onSelectApplication}
          onShowEmailDialog={onShowEmailDialog}
        />
      )}
    </div>
  );
};