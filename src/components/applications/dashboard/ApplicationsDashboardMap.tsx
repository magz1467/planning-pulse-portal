import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { SortType } from "@/hooks/use-sort-applications";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAutoSelect } from "@/hooks/use-auto-select";
import { useCoordinates } from "@/hooks/use-coordinates";

export const ApplicationsDashboardMap = () => {
  const { state, dispatch } = useMapReducer();
  const { applications, isLoading, fetchApplicationsInRadius } = useApplicationsData();
  const isMobile = useIsMobile();

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

  // Auto-select first application on mobile
  useAutoSelect(
    isMobile,
    applications,
    state.selectedId,
    isLoading,
    (id) => dispatch({ type: 'SELECT_APPLICATION', payload: id })
  );

  const handleSortChange = (sortType: SortType | null) => {
    console.log('Handling sort change:', sortType);
    dispatch({ type: 'SET_SORT', payload: sortType });
  };

  const handlePostcodeSelect = async (postcode: string) => {
    console.log('Handling postcode select:', postcode);
    const { coordinates } = await useCoordinates(postcode);
    
    if (coordinates) {
      dispatch({ type: 'SET_COORDINATES', payload: coordinates });
      fetchApplicationsInRadius(coordinates, 1000);
    }
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
        handlePostcodeSelect={handlePostcodeSelect}
        handleSortChange={handleSortChange}
        setIsMapView={(value) => dispatch({ type: 'TOGGLE_VIEW' })}
      />
    </ErrorBoundary>
  );
};