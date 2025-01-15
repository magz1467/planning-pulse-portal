import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useEffect, useCallback } from "react";

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

  // Initialize default status counts outside of render to prevent recreation
  const defaultStatusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  };

  // Memoize the auto-selection handler to prevent recreation
  const handleAutoSelect = useCallback(() => {
    if (filteredApplications.length > 0) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, handleMarkerClick]);

  // Debug logging for selectedId with cleanup
  useEffect(() => {
    const logMessage = `Selected ID state changed: ${selectedId}`;
    console.log(logMessage);
    
    return () => {
      console.log(`Cleaning up selectedId effect: ${selectedId}`);
    };
  }, [selectedId]);

  // Auto-select first application on mobile with proper cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      isMobile && 
      filteredApplications.length > 0 && 
      !selectedId && 
      !isLoading && 
      isMapView
    ) {
      console.log('Auto-selecting first application on mobile - map view only');
      timer = setTimeout(handleAutoSelect, 100);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
        console.log('Cleaned up auto-select timer');
      }
    };
  }, [
    isMobile,
    filteredApplications,
    selectedId,
    isLoading,
    isMapView,
    handleAutoSelect
  ]);

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
      statusCounts={defaultStatusCounts}
      handleMarkerClick={handleMarkerClick}
      handleFilterChange={handleFilterChange}
      handlePostcodeSelect={handlePostcodeSelect}
      handleSortChange={handleSortChange}
    />
  );
};