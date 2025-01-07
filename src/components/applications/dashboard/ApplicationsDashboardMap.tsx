import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useEffect } from "react";

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
  const defaultStatusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  };

  // Debug logging for selectedId
  useEffect(() => {
    console.log('Selected ID state changed:', selectedId);
  }, [selectedId]);

  // Mobile auto-selection effect - only run on initial mount or when map view changes
  useEffect(() => {
    if (isMobile && filteredApplications.length > 0 && !selectedId && isMapView) {
      console.log('Auto-selecting first application on mobile');
      // Add a small delay to prevent immediate re-render
      const timer = setTimeout(() => {
        handleMarkerClick(filteredApplications[0].id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapView]); // Only depend on isMapView changes

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