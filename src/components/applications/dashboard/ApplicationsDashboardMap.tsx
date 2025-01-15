import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";

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
        dispatch={dispatch}
      />
    </ErrorBoundary>
  );
};
