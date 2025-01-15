import { useState, useCallback, useEffect } from 'react';
import { Application } from "@/types/planning";
import { SortType } from "./use-sort-applications";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "./use-coordinates";
import { useFilteredApplications } from "./use-filtered-applications";
import { useURLState } from "./use-url-state";
import { useSelectionState } from "./use-selection-state"; 
import { useFilterState } from "./use-filter-state";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

// Default status counts defined outside component
const DEFAULT_STATUS_COUNTS = {
  'Under Review': 0,
  'Approved': 0,
  'Declined': 0,
  'Other': 0
};

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
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
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

  const handleSortChange = useCallback((sortType: SortType) => {
    setActiveSort(sortType);
  }, []);

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

  // Update URL params when relevant state changes
  useEffect(() => {
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
        description: "There was a problem updating the URL. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [postcode, initialTab, activeFilters.status, selectedId, updateURLParams, toast]);

  const filteredApplications = useFilteredApplications(
    applications || [],
    activeFilters,
    activeSort
  );

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
    statusCounts: { ...DEFAULT_STATUS_COUNTS, ...statusCounts },
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};