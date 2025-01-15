import { useDashboardState } from "@/hooks/use-dashboard-state";
import { DashboardLayout } from "./components/DashboardLayout";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

  // Auto-select first application on mobile when applications are loaded
  useEffect(() => {
    if (isMobile && filteredApplications.length > 0 && !selectedId && !isLoading && isMapView) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [isMobile, filteredApplications, selectedId, isLoading, handleMarkerClick, isMapView]);

  if (!coordinates) return null;

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