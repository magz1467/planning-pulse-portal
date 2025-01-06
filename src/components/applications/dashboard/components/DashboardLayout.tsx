import { DashboardHeader } from "./DashboardHeader";
import { SearchSection } from "./SearchSection";
import { LoadingOverlay } from "./LoadingOverlay";
import { MapSection } from "./MapSection";
import { SidebarSection } from "./SidebarSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";

interface DashboardLayoutProps {
  selectedId: number | null;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  isMapView: boolean;
  setIsMapView: (value: boolean) => void;
  postcode: string;
  coordinates: [number, number] | null;
  isLoading: boolean;
  applications: Application[];
  filteredApplications: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handlePostcodeSelect: (postcode: string) => void;
  handleSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  selectedId,
  activeFilters,
  activeSort,
  isMapView,
  setIsMapView,
  postcode,
  coordinates,
  isLoading,
  applications,
  filteredApplications,
  statusCounts,
  handleMarkerClick,
  handleFilterChange,
  handlePostcodeSelect,
  handleSortChange,
}) => {
  const isMobile = useIsMobile();

  const handleClose = () => {
    handleMarkerClick(null);
  };

  const handleCenterChange = (newCenter: [number, number]) => {
    if (handlePostcodeSelect) {
      handlePostcodeSelect(`${newCenter[0]},${newCenter[1]}`);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative">
      <DashboardHeader />

      <SearchSection 
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={coordinates ? handleFilterChange : undefined}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={isMobile ? () => {
          setIsMapView(!isMapView);
          if (isMapView) {
            handleMarkerClick(null);
          }
        } : undefined}
        applications={applications}
        statusCounts={statusCounts}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex" style={{ zIndex: 10 }}>
          <SidebarSection
            isMobile={isMobile}
            isMapView={isMapView}
            applications={filteredApplications}
            selectedId={selectedId}
            postcode={postcode}
            coordinates={coordinates as [number, number]}
            activeFilters={activeFilters}
            activeSort={activeSort}
            statusCounts={statusCounts}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSelectApplication={handleMarkerClick}
            onClose={handleClose}
          />

          {(!isMobile || isMapView) && (
            <MapSection
              applications={filteredApplications}
              selectedId={selectedId}
              coordinates={coordinates as [number, number]}
              isMobile={isMobile}
              isMapView={isMapView}
              onMarkerClick={handleMarkerClick}
              onCenterChange={handleCenterChange}
            />
          )}
        </div>
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  );
};