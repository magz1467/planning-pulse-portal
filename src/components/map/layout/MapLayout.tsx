import { Application } from "@/types/planning";
import { MapHeader } from "../MapHeader";
import { EmailDialog } from "@/components/EmailDialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { MobileListContainer } from "../mobile/MobileListContainer";
import { MapSection } from "./MapSection";
import { DesktopSidebarSection } from "./DesktopSidebarSection";

interface MapLayoutProps {
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

export const MapLayout = ({
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
}: MapLayoutProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (radius: string) => {
    const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
    toast({
      title: "Subscription pending",
      description: `You will now receive planning alerts within ${radiusText} of ${postcode}`,
      duration: 5000,
    });
  };

  const handleClose = () => {
    onMarkerClick(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <MapHeader 
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={onToggleView}
      />
      
      <div className="flex flex-1 min-h-0 relative">
        <DesktopSidebarSection 
          isMobile={isMobile}
          applications={filteredApplications}
          selectedApplication={selectedApplication}
          postcode={postcode}
          activeFilters={activeFilters}
          activeSort={activeSort}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onSelectApplication={onMarkerClick}
          onClose={handleClose}
        />
        
        <MapSection 
          isMobile={isMobile}
          isMapView={isMapView}
          coordinates={coordinates}
          applications={filteredApplications}
          selectedId={selectedApplication}
          dispatch={(action) => {
            if (action.type === 'SELECT_APPLICATION') {
              onMarkerClick(action.payload);
            }
          }}
          postcode={postcode}
        />
        
        {isMobile && !isMapView && (
          <MobileListContainer
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            postcode={postcode}
            onSelectApplication={onMarkerClick}
            onShowEmailDialog={() => setShowEmailDialog(true)}
            onClose={handleClose}
          />
        )}
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={postcode}
      />
    </div>
  );
};