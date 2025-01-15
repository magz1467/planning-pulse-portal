import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "./components/DashboardLayout";
import { useCallback, useMemo } from "react";
import { useAutoSelect } from "@/hooks/use-auto-select";
import { useErrorHandling } from "@/hooks/use-error-handling";

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

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleView = useCallback(() => {
    setIsMapView(prev => !prev);
  }, [setIsMapView]);

  // Memoize computed values
  const defaultStatusCounts = useMemo(() => ({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  }), [statusCounts]);

  // Use custom hooks for side effects
  useAutoSelect(
    isMobile,
    filteredApplications,
    selectedId,
    isLoading,
    handleMarkerClick
  );

  useErrorHandling(
    isLoading,
    applications.length,
    !!coordinates
  );

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