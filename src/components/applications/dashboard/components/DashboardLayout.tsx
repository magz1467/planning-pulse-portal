import { Application } from "@/types/planning";
import { MapSection } from "./MapSection";
import { SidebarSection } from "./SidebarSection";
import { DashboardHeader } from "./DashboardHeader";
import { LoadingOverlay } from "./LoadingOverlay";
import { useIsMobile } from "@/hooks/use-mobile";
import { SortType } from "@/hooks/use-sort-applications";
import { SearchSection } from "./SearchSection";
import { Header } from "@/components/Header";

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
    <>
      <Header />
      <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
        <SearchSection 
          onPostcodeSelect={handlePostcodeSelect}
          applications={applications}
          isMapView={isMapView}
        />
        
        <DashboardHeader 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort || 'newest'}
          isMapView={isMapView}
          onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
        />
        
        <div className="flex flex-1 min-h-0 relative">
          {isLoading && <LoadingOverlay />}
          
          <SidebarSection 
            isMobile={isMobile}
            isMapView={isMapView}
            applications={filteredApplications}
            selectedId={selectedId}
            postcode={postcode}
            coordinates={coordinates as [number, number]}
            activeFilters={activeFilters}
            activeSort={activeSort as "closingSoon" | "newest"}
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
            dispatch={(action) => {
              if (action.type === 'SELECT_APPLICATION') {
                handleMarkerClick(action.payload);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};