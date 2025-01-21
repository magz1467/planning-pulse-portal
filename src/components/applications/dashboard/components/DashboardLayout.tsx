import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContentLayout } from "@/components/map/MapContentLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { FilterBar } from "@/components/FilterBar";
import { SearchSection } from "@/components/applications/dashboard/components/SearchSection";
import { ClassificationFilters } from "@/components/map/filter/ClassificationFilters";

interface DashboardLayoutProps {
  applications: Application[];
  selectedId: number | null;
  isMapView: boolean;
  coordinates: [number, number];
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  postcode: string;
  isLoading: boolean;
  filteredApplications: Application[];
  handleMarkerClick: (id: number) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handlePostcodeSelect: (postcode: string) => void;
  handleSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
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
  isLoading,
  filteredApplications,
  handleMarkerClick,
  handleFilterChange,
  handlePostcodeSelect,
  handleSortChange,
  setIsMapView,
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <SearchSection
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={() => setIsMapView(!isMapView)}
        applications={applications}
      />
      <ClassificationFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilters.type}
      />
      {!isMobile && (
        <FilterBar
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort}
          isMapView={isMapView}
          onToggleView={() => setIsMapView(!isMapView)}
          applications={applications}
        />
      )}
      <ErrorBoundary>
        <MapContentLayout
          isLoading={isLoading}
          coordinates={coordinates}
          postcode={postcode}
          selectedApplication={selectedId}
          filteredApplications={filteredApplications}
          activeFilters={activeFilters}
          activeSort={activeSort}
          isMapView={isMapView}
          isMobile={isMobile}
          dispatch={({ type, payload }) => {
            if (type === 'SELECT_APPLICATION') {
              handleMarkerClick(payload);
            }
          }}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onToggleView={() => setIsMapView(!isMapView)}
        />
      </ErrorBoundary>
    </div>
  );
};