import { FilterBar } from "@/components/FilterBar";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { getStatusColor } from "@/utils/statusColors";
import { useRef, useEffect } from "react";
import { MiniCard } from "./MiniCard";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";

interface MobileListContainerProps {
  applications: any[];
  selectedApplication: number | null;
  postcode: string;
  onSelectApplication: (id: number) => void;
  onShowEmailDialog: () => void;
  hideFilterBar?: boolean;
  onClose: () => void;
}

export const MobileListContainer = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  hideFilterBar = false,
  onClose,
}: MobileListContainerProps) => {
  const detailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailsContainerRef.current) {
      detailsContainerRef.current.scrollTop = 0;
    }
  }, [selectedApplication]);

  const selectedApp = applications.find(app => app.id === selectedApplication);

  return (
    <div className="flex-1 flex flex-col h-full max-h-[100dvh] overflow-hidden bg-gray-50">
      {selectedApplication !== null && selectedApp ? (
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
          <div ref={detailsContainerRef} className="flex-1 overflow-y-auto">
            <PlanningApplicationDetails
              application={selectedApp}
              onClose={onClose}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 bg-white border-b">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed about new planning applications near {postcode}
              </p>
              <Button 
                className="w-full"
                onClick={onShowEmailDialog}
              >
                Get Alerts
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectApplication(app.id)}
              >
                <div className="flex gap-4">
                  {app.image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <ApplicationTitle 
                      title={app.ai_title || app.description || ''} 
                      className="line-clamp-2 mb-1"
                    />
                    <p className="text-sm text-gray-600 mt-1 truncate">{app.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-500">{app.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};