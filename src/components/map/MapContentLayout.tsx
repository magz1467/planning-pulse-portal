import { Application } from "@/types/planning";
import { MapHeader } from "./MapHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { MapContainerComponent } from "./MapContainer";
import { MobileApplicationCards } from "./MobileApplicationCards";
import { LoadingOverlay } from "./LoadingOverlay";
import { FilterBar } from "@/components/FilterBar";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { getStatusColor } from "@/utils/statusColors";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { EmailDialog } from "@/components/EmailDialog";
import { useToast } from "@/components/ui/use-toast";

interface MapContentLayoutProps {
  isLoading: boolean;
  coordinates: [number, number];
  postcode: string;
  selectedApplication: number | null;
  filteredApplications: Application[];
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  isMapView: boolean;
  isMobile: boolean;
  onMarkerClick: (id: number) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  onToggleView: () => void;
}

export const MapContentLayout = ({
  isLoading,
  coordinates,
  postcode,
  selectedApplication,
  filteredApplications,
  activeFilters,
  activeSort,
  isMapView,
  isMobile,
  onMarkerClick,
  onFilterChange,
  onSortChange,
  onToggleView,
}: MapContentLayoutProps) => {
  const selectedApp = filteredApplications.find(app => app.id === selectedApplication);
  const detailsContainerRef = useRef<HTMLDivElement>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  // Select first application by default when applications load
  useEffect(() => {
    if (filteredApplications.length > 0 && !selectedApplication && isMapView) {
      onMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedApplication, isMapView, onMarkerClick]);

  const handleEmailSubmit = (email: string, radius: string) => {
    const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
    toast({
      title: "Subscription pending",
      description: `We've sent a confirmation email to ${email}. Please check your inbox and click the link to confirm your subscription for planning alerts within ${radiusText} of ${postcode}. The email might take a few minutes to arrive.`,
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {isLoading && <LoadingOverlay />}
      
      <MapHeader 
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={onToggleView}
      />
      
      <div className="flex flex-1 min-h-0 relative">
        {!isMobile && (
          <DesktopSidebar
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            postcode={postcode}
            activeFilters={activeFilters}
            activeSort={activeSort}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onSelectApplication={onMarkerClick}
            onClose={() => onMarkerClick(null)}
          />
        )}
        
        <div 
          className={`flex-1 relative ${isMobile ? (isMapView ? 'block' : 'hidden') : 'block'}`}
          style={{ height: isMobile ? 'calc(100dvh - 120px)' : '100%' }}
        >
          <MapContainerComponent
            coordinates={coordinates}
            postcode={postcode}
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            onMarkerClick={onMarkerClick}
          />

          {isMobile && selectedApplication !== null && (
            <MobileApplicationCards
              applications={filteredApplications}
              selectedId={selectedApplication}
              onSelectApplication={onMarkerClick}
            />
          )}
        </div>
        
        {isMobile && !isMapView && (
          <div className="absolute inset-0 flex flex-col h-full max-h-[100dvh] overflow-hidden bg-gray-50">
            <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
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
                    onClick={() => setShowEmailDialog(true)}
                  >
                    Get Alerts
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onMarkerClick(app.id)}
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
                        <h3 className="font-semibold text-primary truncate">{app.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{app.address}</p>
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
          </div>
        )}

        {selectedApplication !== null && selectedApp && !isMapView && (
          <div className="fixed inset-0 z-50 bg-white animate-in slide-in-from-bottom duration-300">
            <div className="h-full flex flex-col bg-white">
              <div className="sticky top-0 z-50 border-b py-2 px-4 bg-white flex justify-between items-center shadow-sm">
                <h2 className="font-semibold">Planning Application Details</h2>
                <button 
                  onClick={() => onMarkerClick(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div ref={detailsContainerRef} className="flex-1 overflow-y-auto">
                <PlanningApplicationDetails
                  application={selectedApp}
                  onClose={() => onMarkerClick(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};