import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";
import { MapAction } from "@/types/map-reducer";
import type { DashboardLayoutProps } from "./components/DashboardLayout";

interface ExtendedDashboardLayoutProps extends Omit<DashboardLayoutProps, 'handleMarkerClick'> {
  dispatch: React.Dispatch<MapAction>;
}

export const ApplicationsDashboardMap = () => {
  const { state, dispatch } = useMapReducer();

  // Example of how to update applications when they're fetched
  useEffect(() => {
    // Your existing fetch logic here
    // When applications are loaded:
    // dispatch({ type: 'SET_APPLICATIONS', payload: fetchedApplications });
  }, []);

  return (
    <ErrorBoundary>
      <DashboardLayout
        applications={state.applications}
        selectedId={state.selectedId}
        isMapView={state.isMapView}
        coordinates={state.coordinates}
        activeFilters={{}}
        activeSort={null}
        postcode=""
        isLoading={false}
        filteredApplications={state.applications}
        handleMarkerClick={(id) => dispatch({ type: 'SELECT_APPLICATION', payload: id })}
        handleFilterChange={() => {}}
        handlePostcodeSelect={() => {}}
        handleSortChange={() => {}}
        setIsMapView={(value) => dispatch({ type: value ? 'TOGGLE_VIEW' : 'TOGGLE_VIEW' })}
      />
    </ErrorBoundary>
  );
};