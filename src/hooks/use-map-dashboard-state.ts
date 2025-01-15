import { useEffect } from 'react';
import { useCoordinates } from '@/hooks/use-coordinates';
import { useFilteredApplications } from '@/hooks/use-filtered-applications';
import { useURLState } from './use-url-state';
import { useSelectionState } from './use-selection-state';
import { useFilterState } from './use-filter-state';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';
import { useMapViewState } from './use-map-view-state';
import { useSearchState } from './use-search-state';
import { useApplicationsState } from './use-applications-state';
import { LatLngTuple } from 'leaflet';

export const useMapDashboardState = () => {
  const { 
    initialPostcode, 
    initialTab, 
    initialFilter,
    initialApplicationId,
    updateURLParams 
  } = useURLState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { selectedId, handleMarkerClick } = useSelectionState(initialApplicationId);
  const { activeFilters, handleFilterChange } = useFilterState(initialFilter);
  const { isMapView, setIsMapView } = useMapViewState();
  const { 
    postcode,
    isSearching,
    searchStartTime,
    setSearchStartTime,
    setIsSearching,
    handlePostcodeSelect,
    logSearch
  } = useSearchState();

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const {
    applications,
    isLoadingApps,
    activeSort,
    handleSortChange,
    statusCounts
  } = useApplicationsState(coordinates ? [coordinates[0], coordinates[1]] as LatLngTuple : null);

  // Handle search errors and URL updates
  useEffect(() => {
    if (isSearching && !coordinates) {
      toast({
        title: "Location Error",
        description: "We couldn't find that location. Please check the postcode and try again.",
        variant: "destructive",
      });
      setIsSearching(false);
      navigate("/");
      return;
    }

    try {
      updateURLParams({
        postcode,
        tab: initialTab,
        filter: activeFilters.status,
        applicationId: selectedId
      });
    } catch (error) {
      console.error('URL update error:', error);
      toast({
        title: "Navigation Error",
        description: "There was a problem updating the page URL. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [postcode, initialTab, activeFilters.status, selectedId, updateURLParams, coordinates, isSearching, navigate, toast, setIsSearching]);

  // Handle search completion
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000;
      logSearch(loadTime);
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime, logSearch, setSearchStartTime, setIsSearching]);

  const filteredApplications = useFilteredApplications(
    applications || [],
    activeFilters,
    activeSort
  );

  const defaultStatusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  };

  return {
    selectedId,
    activeFilters,
    activeSort,
    isMapView,
    setIsMapView,
    postcode,
    coordinates,
    isLoading: isLoadingCoords || isLoadingApps,
    applications,
    filteredApplications,
    statusCounts: defaultStatusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};