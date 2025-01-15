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
  }, [selectedId]); // Only re-run when selectedId changes

  // Auto-select first application on mobile when applications are loaded
  useEffect(() => {
    if (
      isMobile && 
      filteredApplications.length > 0 && 
      !selectedId && 
      !isLoading && 
      isMapView
    ) {
      console.log('Auto-selecting first application on mobile - map view only');
      // Add a small delay to prevent immediate re-render
      const timer = setTimeout(() => {
        handleMarkerClick(filteredApplications[0].id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [
    isMobile, 
    filteredApplications, 
    selectedId, 
    isLoading, 
    handleMarkerClick, 
    isMapView
  ]); // Added proper dependency array

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