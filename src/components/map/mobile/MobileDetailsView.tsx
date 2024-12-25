import { Application } from "@/types/planning";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface MobileDetailsViewProps {
  application: Application;
  onClose: () => void;
}

export const MobileDetailsView = ({ application, onClose }: MobileDetailsViewProps) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom duration-300">
      <div className="h-full flex flex-col bg-white">
        <div className="sticky top-0 z-50 border-b py-2 px-4 bg-white flex justify-between items-center shadow-sm">
          <h2 className="font-semibold">Planning Application Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <PlanningApplicationDetails
            application={application}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};