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
    <div className="flex-1 flex flex-col h-full max-h-[100dvh] overflow-hidden bg-gray-50">
      {selectedApplication !== null && selectedApp ? (
        <div className="h-full flex flex-col bg-white">
          <div className="sticky top-0 z-50 border-b py-2 px-4 bg-white flex justify-between items-center shadow-sm">
            <h2 className="font-semibold">Planning Application Details</h2>
            <button 
              onClick={() => onSelectApplication(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <MobileDetailsView
            application={selectedApp}
            onClose={() => onSelectApplication(null)}
          />
        </div>
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