import { useState } from "react";
import { MapHeader } from "../MapHeader";
import { MapContainer } from "./components/MapContainer";
import { EmailDialogWrapper } from "./components/EmailDialogWrapper";
import { DesktopSidebar } from "../DesktopSidebar";
import { MobileListContainer } from "../mobile/MobileListContainer";

interface MapLayoutProps {
  isLoading: boolean;
  coordinates: [number, number];
  postcode: string;
  selectedApplication: number | null;
  filteredApplications: any[];
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
            onClose={handleClose}
          />
        )}
        
        <MapContainer
          isMobile={isMobile}
          isMapView={isMapView}
          coordinates={coordinates}
          applications={filteredApplications}
          selectedApplication={selectedApplication}
          onMarkerClick={onMarkerClick}
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

      <EmailDialogWrapper
        showEmailDialog={showEmailDialog}
        setShowEmailDialog={setShowEmailDialog}
        postcode={postcode}
      />
    </div>
  );
};