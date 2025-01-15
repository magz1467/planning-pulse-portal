import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";

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

  // Initialize default status counts with useMemo to prevent unnecessary recalculations
  const defaultStatusCounts = useMemo(() => ({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  }), [statusCounts]);

  // Memoize handlers
  const handleToggleView = useCallback(() => {
    setIsMapView(prev => !prev);
  }, [setIsMapView]);

  // Show error toast if applications fail to load
  useEffect(() => {
    if (!isLoading && applications.length === 0 && coordinates) {
      toast({
        title: "No applications found",
        description: "Try adjusting your search area or filters",
        variant: "destructive",
      });
    }
  }, [isLoading, applications.length, coordinates]);

  // Auto-select first application on mobile when applications are loaded
  useEffect(() => {
    if (isMobile && filteredApplications.length > 0 && !selectedId && !isLoading && isMapView) {
      const timer = setTimeout(() => {
        handleMarkerClick(filteredApplications[0].id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredApplications, handleMarkerClick, isMobile, isLoading, isMapView, selectedId]);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default ApplicationsDashboardMap;