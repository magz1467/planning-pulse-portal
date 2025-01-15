import { useEffect } from 'react';
import { useCoordinates } from './use-coordinates';
import { useFilterState } from './use-filter-state';
import { useMapViewState } from './use-map-view-state';
import { useSearchState } from './use-search-state';
import { useApplicationsState } from './use-applications-state';
import { useFilteredApplications } from './use-filtered-applications';
import { useURLState } from './use-url-state';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

export const useMapDashboardState = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    initialPostcode, 
    initialTab, 
    initialFilter,
    initialApplicationId,
    updateURLParams 
  } = useURLState();

  const { activeFilters, handleFilterChange } = useFilterState(initialFilter);
  const { isMapView, setIsMapView, selectedId, handleMarkerClick } = useMapViewState();
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
  } = useApplicationsState(coordinates ? [coordinates[0], coordinates[1]] : null);

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