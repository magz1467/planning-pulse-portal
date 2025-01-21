import { Application } from "@/types/planning";
import { MapSection } from "./MapSection";
import { SidebarSection } from "./SidebarSection";
import { DashboardHeader } from "./DashboardHeader";
import { LoadingOverlay } from "./LoadingOverlay";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterControls } from "@/components/map/filter/FilterControls";
import { SortType } from "@/hooks/use-sort-applications";

interface DashboardLayoutProps {
  applications: Application[];
  selectedId: number | null;
  isMapView: boolean;
  coordinates: [number, number] | null;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType | null;
  postcode: string;
  isLoading?: boolean;
  filteredApplications: Application[];
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handlePostcodeSelect: (postcode: string) => void;
  handleSortChange: (sortType: SortType | null) => void;
  setIsMapView: (value: boolean) => void;
}

export const DashboardLayout = ({
  applications,
  selectedId,
  isMapView,
  coordinates,
  activeFilters,
  activeSort,
  postcode,
  isLoading = false,
  filteredApplications,
  handleMarkerClick,
  handleFilterChange,
  handlePostcodeSelect,
  handleSortChange,
  setIsMapView
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <DashboardHeader 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={() => setIsMapView(!isMapView)}
      />
      
      <div className="p-4 border-b">
        <FilterControls 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort || null}
          isMobile={isMobile}
          applications={applications}
          isMapView={isMapView}
          onToggleView={() => setIsMapView(!isMapView)}
        />
      </div>
      
      <div className="flex flex-1 min-h-0 relative">
        {isLoading && <LoadingOverlay />}
        
        <SidebarSection 
          isMobile={isMobile}
          applications={filteredApplications}
          selectedApplication={selectedId}
          postcode={postcode}
          activeFilters={activeFilters}
          activeSort={activeSort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSelectApplication={handleMarkerClick}
          onClose={() => handleMarkerClick(null)}
        />
        
        <MapSection 
          isMobile={isMobile}
          isMapView={isMapView}
          coordinates={coordinates}
          applications={filteredApplications}
          selectedId={selectedId}
          handleMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
};