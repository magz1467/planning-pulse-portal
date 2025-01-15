import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapDashboardState } from "@/hooks/use-map-dashboard-state";

export const ApplicationsDashboardMap = () => {
  const isMobile = useIsMobile();
  const mapState = useMapDashboardState();

  // Add error boundary logging
  console.log('ApplicationsDashboardMap - Rendering with state:', {
    selectedId: mapState.selectedId,
    hasCoordinates: !!mapState.coordinates,
    applicationsCount: mapState.applications?.length,
    isLoading: mapState.isLoading
  });

  return (
    <DashboardLayout
      selectedId={mapState.selectedId}
      activeFilters={mapState.activeFilters}
      activeSort={mapState.activeSort}
      isMapView={mapState.isMapView}
      setIsMapView={mapState.setIsMapView}
      postcode={mapState.postcode}
      coordinates={mapState.coordinates}
      isLoading={mapState.isLoading}
      applications={mapState.applications}
      filteredApplications={mapState.filteredApplications}
      statusCounts={mapState.statusCounts}
      handleMarkerClick={mapState.handleMarkerClick}
      handleFilterChange={mapState.handleFilterChange}
      handlePostcodeSelect={mapState.handlePostcodeSelect}
      handleSortChange={mapState.handleSortChange}
      isMobile={isMobile}
    />
  );
};