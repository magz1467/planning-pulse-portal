import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useEffect, useRef } from "react";

export const ApplicationsDashboardMap = () => {
  const isMobile = useIsMobile();
  const hasAutoSelected = useRef(false);
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

  // Mobile auto-selection effect with useRef to prevent infinite loop
  useEffect(() => {
    if (
      isMobile && 
      filteredApplications.length > 0 && 
      !selectedId && 
      isMapView && 
      !hasAutoSelected.current
    ) {
      console.log('Auto-selecting first application on mobile');
      hasAutoSelected.current = true;
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedId, handleMarkerClick, isMapView, isMobile]);

  // Reset the auto-selection flag when key dependencies change
  useEffect(() => {
    if (!isMapView || !isMobile) {
      hasAutoSelected.current = false;
    }
  }, [isMapView, isMobile]);

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