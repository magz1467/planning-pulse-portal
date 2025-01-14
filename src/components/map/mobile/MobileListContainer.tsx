import { FilterBar } from "@/components/FilterBar";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { getStatusColor } from "@/utils/statusColors";
import { useRef, useEffect } from "react";
import { MiniCard } from "./MiniCard";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { ImageResolver } from "./components/ImageResolver";
import { StatusBadge } from "./components/StatusBadge";
import { cn } from "@/lib/utils";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";

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
  const [showAlerts, setShowAlerts] = useState(true);

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
          {showAlerts && (
            <div className="p-4 bg-white border-b relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => setShowAlerts(false)}
              >
                <X className="h-4 w-4" />
              </Button>
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
          )}
          <div className="p-4 space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectApplication(app.id)}
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <ImageResolver
                      imageMapUrl={app.image_map_url}
                      image={app.image}
                      title={app.title || app.description || ''}
                      applicationId={app.id}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ApplicationTitle 
                      title={app.engaging_title || app.ai_title || app.description || ''} 
                      className="line-clamp-2 mb-1"
                    />
                    <p className="text-sm text-gray-600 mt-1 truncate">{app.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <ApplicationBadges
                        status={app.status}
                        lastDateConsultationComments={app.last_date_consultation_comments}
                        class3={app.class_3}
                      />
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
