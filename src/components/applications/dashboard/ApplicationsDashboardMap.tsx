import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useLocation } from "react-router-dom";
import { useApplicationState } from "@/hooks/applications/use-application-state";

export const ApplicationsDashboardMap = () => {
  const location = useLocation();
  const searchPostcode = location.state?.postcode;
  
  const {
    selectedId,
    activeFilters,
    activeSort,
    isMapView,
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
    setIsMapView
  } = useApplicationState(searchPostcode);

  return (
    <ErrorBoundary>
      <DashboardLayout
        applications={applications}
        selectedId={selectedId}
        isMapView={isMapView}
        coordinates={coordinates as [number, number]}
        activeFilters={activeFilters}
        activeSort={activeSort}
        postcode={postcode}
        isLoading={isLoading}
        filteredApplications={filteredApplications}
        handleMarkerClick={handleMarkerClick}
        handleFilterChange={handleFilterChange}
        handlePostcodeSelect={handlePostcodeSelect}
        handleSortChange={handleSortChange}
        setIsMapView={(value) => setIsMapView(value)}
      />
    </ErrorBoundary>
  );
};