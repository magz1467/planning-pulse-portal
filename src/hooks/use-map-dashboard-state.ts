import { useState, useCallback, useEffect } from 'react';
import { Application } from "@/types/planning";
import { SortType } from "./use-sort-applications";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "./use-coordinates";
import { useFilteredApplications } from "./use-filtered-applications";
import { useURLState } from "./use-url-state";
import { useMapState } from "./use-map-state";
import { useFilterState } from "./use-filter-state";
import { useToast } from "./use-toast";

const DEFAULT_STATUS_COUNTS = {
  'Under Review': 0,
  'Approved': 0,
  'Declined': 0,
  'Other': 0
};

export const useMapDashboardState = () => {
  const { toast } = useToast();
  const { initialPostcode, initialTab, initialFilter, initialApplicationId, updateURLParams } = useURLState();
  const mapState = useMapState();
  const filterState = useFilterState(initialFilter);
  const [postcode, setPostcode] = useState(initialPostcode || '');
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts
  } = useApplicationsData();

  const handlePostcodeSelect = useCallback(async (newPostcode: string) => {
    if (!newPostcode) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid postcode to search.",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchStartTime(Date.now());
    setPostcode(newPostcode);
  }, [toast]);

  useEffect(() => {
    if (coordinates) {
      try {
        fetchApplicationsInRadius(coordinates, 1000);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: "There was a problem fetching planning applications. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [coordinates, fetchApplicationsInRadius, toast]);

  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime]);

  useEffect(() => {
    try {
      updateURLParams({
        postcode,
        tab: initialTab,
        filter: filterState.activeFilters.status,
        applicationId: mapState.selectedId
      });
    } catch (error) {
      console.error('URL update error:', error);
      toast({
        title: "Navigation Error",
        description: "There was a problem updating the URL. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [postcode, initialTab, filterState.activeFilters.status, mapState.selectedId, updateURLParams, toast]);

  const filteredApplications = useFilteredApplications(
    applications || [],
    filterState.activeFilters,
    mapState.activeSort
  );

  return {
    selectedId: mapState.selectedId,
    activeFilters: filterState.activeFilters,
    activeSort: mapState.activeSort,
    isMapView: mapState.isMapView,
    setIsMapView: mapState.setIsMapView,
    postcode,
    coordinates,
    isLoading: isLoadingCoords || isLoadingApps,
    applications,
    filteredApplications,
    statusCounts: { ...DEFAULT_STATUS_COUNTS, ...statusCounts },
    handleMarkerClick: mapState.handleMarkerClick,
    handleFilterChange: filterState.handleFilterChange,
    handlePostcodeSelect,
    handleSortChange: mapState.handleSortChange,
  };
};