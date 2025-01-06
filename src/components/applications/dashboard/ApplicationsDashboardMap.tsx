import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useEffect, useCallback, useMemo } from "react";

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

  // Initialize default status counts
  const defaultStatusCounts = useMemo(() => ({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  }), [statusCounts]);

  // Memoize coordinates to prevent unnecessary re-renders
  const memoizedCoordinates = useMemo(() => coordinates as [number, number], [coordinates]);

  // Memoize filtered applications to prevent unnecessary re-renders
  const memoizedFilteredApplications = useMemo(() => filteredApplications, [filteredApplications]);

  // Memoize the marker click handler
  const memoizedHandleMarkerClick = useCallback((id: number | null) => {
    handleMarkerClick(id);
  }, [handleMarkerClick]);

  // Memoize filter change handler
  const memoizedHandleFilterChange = useCallback((filterType: string, value: string) => {
    handleFilterChange(filterType, value);
  }, [handleFilterChange]);

  // Memoize sort change handler
  const memoizedHandleSort = useCallback((sortType: any) => {
    handleSortChange(sortType);
  }, [handleSortChange]);

  // Mobile auto-selection effect
  useEffect(() => {
    if (isMobile && filteredApplications.length > 0 && !selectedId && isMapView) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedId, handleMarkerClick, isMapView, isMobile]);

  // Only render layout if coordinates exist or loading is complete
  if (!coordinates && !isLoading) {
    return null;
  }

  return (
    <DashboardLayout
      selectedId={selectedId}
      activeFilters={activeFilters}
      activeSort={activeSort}
      isMapView={isMapView}
      setIsMapView={setIsMapView}
      postcode={postcode}
      coordinates={memoizedCoordinates}
      isLoading={isLoading}
      applications={applications}
      filteredApplications={memoizedFilteredApplications}
      statusCounts={defaultStatusCounts}
      handleMarkerClick={memoizedHandleMarkerClick}
      handleFilterChange={memoizedHandleFilterChange}
      handlePostcodeSelect={handlePostcodeSelect}
      handleSortChange={memoizedHandleSort}
    />
  );
};