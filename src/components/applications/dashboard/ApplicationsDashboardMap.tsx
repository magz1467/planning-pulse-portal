import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "./components/DashboardHeader";
import { SearchSection } from "./components/SearchSection";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MobileListContainer } from "@/components/map/mobile/MobileListContainer";
import { MapView } from "./components/MapView";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { useEffect } from "react";

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

  // Select first application by default when applications are loaded, but only in map view
  useEffect(() => {
    if (filteredApplications.length > 0 && !selectedId && isMapView) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedId, handleMarkerClick, isMapView]);

  const handleClose = () => {
    handleMarkerClick(null);
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
          // Clear selection when switching to list view
          if (isMapView) {
            handleMarkerClick(null);
          }
        } : undefined}
        applications={applications}
        statusCounts={statusCounts}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex">
          {!isMobile && coordinates && (
            <DesktopSidebar
              applications={filteredApplications}
              selectedApplication={selectedId}
              postcode={postcode}
              activeFilters={activeFilters}
              activeSort={activeSort}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onSelectApplication={handleMarkerClick}
              onClose={handleClose}
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
              {isMobile && selectedId && (
                <MobileApplicationCards
                  applications={filteredApplications}
                  selectedId={selectedId}
                  onSelectApplication={handleMarkerClick}
                />
              )}
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
              onClose={handleClose}
            />
          )}
        </div>
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  );
};