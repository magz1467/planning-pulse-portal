import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";
import { MapAction } from "@/types/map-reducer";

export const ApplicationsDashboardMap = () => {
  const { state, dispatch } = useMapReducer();

  // Example of how to update applications when they're fetched
  useEffect(() => {
    // Initialize with default coordinates for London
    dispatch({ 
      type: 'SET_COORDINATES', 
      payload: [51.5074, -0.1278] 
    });
  }, []);

  return (
    <ErrorBoundary>
      <DashboardLayout
        applications={state.applications || []}
        selectedId={state.selectedId}
        isMapView={state.isMapView}
        coordinates={state.coordinates}
        activeFilters={{}}
        activeSort={null}
        postcode=""
        isLoading={false}
        filteredApplications={state.applications || []}
        handleMarkerClick={(id) => dispatch({ type: 'SELECT_APPLICATION', payload: id })}
        handleFilterChange={() => {}}
        handlePostcodeSelect={() => {}}
        handleSortChange={() => {}}
        setIsMapView={(value) => dispatch({ type: 'TOGGLE_VIEW' })}
      />
    </ErrorBoundary>
  );
};