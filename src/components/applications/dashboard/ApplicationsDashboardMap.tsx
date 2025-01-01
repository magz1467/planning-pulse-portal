import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "./components/DashboardHeader";
import { SearchSection } from "./components/SearchSection";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MobileListContainer } from "@/components/map/mobile/MobileListContainer";
import { MapView } from "./components/MapView";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { useDashboardState } from "@/hooks/use-dashboard-state";

export const ApplicationsDashboardMap = () => {
  const isMobile = useIsMobile();
  const {
    selectedId,
    selectedApplication,
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
  } = useDashboardState();

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
        onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
        applications={applications}
        statusCounts={statusCounts}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex">
          {(!isMobile || !isMapView) && coordinates && (
            <DesktopSidebar
              applications={filteredApplications}
              selectedApplication={selectedId}
              postcode={postcode}
              activeFilters={activeFilters}
              activeSort={activeSort}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onSelectApplication={handleMarkerClick}
              onClose={() => handleMarkerClick(null)}
              statusCounts={statusCounts}
            />
          )}

          {(!isMobile || isMapView) && coordinates && (
            <div className="flex-1 relative">
              <MapView
                applications={filteredApplications}
                selectedId={selectedId}
                onMarkerClick={handleMarkerClick}
                initialCenter={coordinates}
              />
            </div>
          )}

          {isMobile && !isMapView && coordinates && (
            <MobileListContainer
              applications={filteredApplications}
              selectedApplication={selectedId}
              postcode={postcode}
              onSelectApplication={handleMarkerClick}
              onShowEmailDialog={() => {}}
              hideFilterBar={true}
            />
          )}
        </div>
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  );
};