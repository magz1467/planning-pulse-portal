import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { SortType } from "@/hooks/use-sort-applications";

export const ApplicationsDashboardMap = () => {
  const { state, dispatch } = useMapReducer();
  const { applications, isLoading, fetchApplicationsInRadius } = useApplicationsData();

  // Initialize map and fetch applications
  useEffect(() => {
    const defaultCoords: [number, number] = [51.5074, -0.1278]; // London
    dispatch({ type: 'SET_COORDINATES', payload: defaultCoords });
    
    // Fetch applications within 1km radius of London
    if (defaultCoords) {
      fetchApplicationsInRadius(defaultCoords, 1000);
    }
  }, []);

  // Update applications in state when they're fetched
  useEffect(() => {
    if (applications.length > 0) {
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
    }
  }, [applications]);

  const handleSortChange = (sortType: SortType | null) => {
    console.log('Handling sort change:', sortType);
    dispatch({ type: 'SET_SORT', payload: sortType });
  };

  return (
    <ErrorBoundary>
      <DashboardLayout
        applications={state.applications || []}
        selectedId={state.selectedId}
        isMapView={state.isMapView}
        coordinates={state.coordinates}
        activeFilters={{}}
        activeSort={state.activeSort}
        postcode=""
        isLoading={isLoading}
        filteredApplications={state.applications || []}
        handleMarkerClick={(id) => dispatch({ type: 'SELECT_APPLICATION', payload: id })}
        handleFilterChange={() => {}}
        handlePostcodeSelect={() => {}}
        handleSortChange={handleSortChange}
        setIsMapView={(value) => dispatch({ type: 'TOGGLE_VIEW' })}
      />
    </ErrorBoundary>
  );
};