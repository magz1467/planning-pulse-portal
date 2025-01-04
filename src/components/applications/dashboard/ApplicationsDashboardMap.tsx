import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";

export const ApplicationsDashboardMap = () => {
  const isMobile = useIsMobile();
  const {
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
  } = useDashboardState();

  // Select first application by default when applications are loaded, but only on mobile and in map view
  useEffect(() => {
    if (isMobile && filteredApplications.length > 0 && !selectedId && isMapView) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedId, handleMarkerClick, isMapView, isMobile]);

  return (
    <DashboardLayout
      selectedId={selectedId}
      activeFilters={activeFilters}
      activeSort={activeSort}
      isMapView={isMapView}
      setIsMapView={setIsMapView}
      postcode={postcode}
      coordinates={coordinates as [number, number]}
      isLoading={isLoading}
      applications={applications}
      filteredApplications={filteredApplications}
      statusCounts={statusCounts}
      handleMarkerClick={handleMarkerClick}
      handleFilterChange={handleFilterChange}
      handlePostcodeSelect={handlePostcodeSelect}
      handleSortChange={handleSortChange}
    />
  );
};