import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "./components/DashboardLayout";
import { useMapReducer } from "@/hooks/use-map-reducer";
import { useEffect } from "react";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { SortType } from "@/hooks/use-sort-applications";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAutoSelect } from "@/hooks/use-auto-select";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useLocation } from "react-router-dom";

export const ApplicationsDashboardMap = () => {
  const { state, dispatch } = useMapReducer();
  const { applications, isLoading, fetchApplicationsInRadius } = useApplicationsData();
  const isMobile = useIsMobile();
  const location = useLocation();
  const searchPostcode = location.state?.postcode;

  // Initialize map and fetch applications
  useEffect(() => {
    const defaultCoords: [number, number] = [51.5074, -0.1278]; // London
    
    // Only use default coordinates if no postcode is provided
    if (!searchPostcode) {
      console.log('No postcode provided, using default London coordinates');
      dispatch({ type: 'SET_COORDINATES', payload: defaultCoords });
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

  const handleSortChange = (sortType: "closingSoon" | "newest" | null) => {
    console.log('Handling sort change:', sortType);
    dispatch({ type: 'SET_SORT', payload: sortType });
  };

  const handlePostcodeSelect = async (postcode: string) => {
    console.log('Handling postcode select:', postcode);
    const { coordinates } = await useCoordinates(postcode);
    
    if (coordinates) {
      dispatch({ type: 'SET_COORDINATES', payload: coordinates as [number, number] });
      fetchApplicationsInRadius(coordinates as [number, number], 1000);
    }
  };

  // Handle initial postcode search
  useEffect(() => {
    const initializeWithPostcode = async () => {
      if (searchPostcode) {
        console.log('Initializing with search postcode:', searchPostcode);
        await handlePostcodeSelect(searchPostcode);
      }
    };

    initializeWithPostcode();
  }, [searchPostcode]);

  return (
    <ErrorBoundary>
      <DashboardLayout
        applications={state.applications || []}
        selectedId={state.selectedId}
        isMapView={state.isMapView}
        coordinates={state.coordinates}
        activeFilters={{}}
        activeSort={state.activeSort}
        postcode={searchPostcode || ""}
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