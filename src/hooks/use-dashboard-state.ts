import { useState, useEffect, useMemo } from "react";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { SortType } from "./use-application-sorting";
import { useURLState } from "./use-url-state";
import { useSelectionState } from "./use-selection-state";
import { useFilterState } from "./use-filter-state";
import { useDashboardURL } from "./dashboard/use-dashboard-url";
import { useSearchState } from "./dashboard/use-search-state";
import { useSearchLogging } from "./dashboard/use-search-logging";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useDashboardState = () => {
  const navigate = useNavigate();
  const { 
    initialPostcode, 
    initialTab, 
    initialFilter,
    initialApplicationId
  } = useURLState();

  const { selectedId, handleMarkerClick } = useSelectionState(initialApplicationId);
  const { activeFilters, handleFilterChange } = useFilterState(initialFilter);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(initialPostcode || '');

  const {
    isSearching,
    setIsSearching,
    searchStartTime,
    setSearchStartTime,
    searchPoint,
    setSearchPoint,
    handlePostcodeSelect
  } = useSearchState();

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts,
    error
  } = useApplicationsData();

  const { logSearch } = useSearchLogging();
  
  useDashboardURL(postcode, activeFilters, selectedId, initialTab);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading applications",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  }, [error]);

  // Handle coordinates updates and search
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

    const isInitialSearch = !searchPoint && coordinates;
    const isNewSearch = searchPoint && coordinates && 
      (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

    if (isInitialSearch || isNewSearch) {
      console.log('Fetching applications with coordinates:', coordinates);
      try {
        const [lat, lng] = coordinates;
        const tuple: [number, number] = [lat, lng];
        setSearchPoint(tuple);
        fetchApplicationsInRadius(tuple, 1000);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: "There was a problem fetching planning applications. Please try again or contact support if the issue persists.",
          variant: "destructive",
        });
        setIsSearching(false);
      }
    }
  }, [coordinates]);

  // Handle search completion and logging
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000;
      console.log('Search completed, logging with load time:', loadTime);
      logSearch(postcode, initialTab, loadTime);
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime]);

  const handleSortChange = (sortType: SortType) => {
    console.log('Changing sort to:', sortType);
    setActiveSort(sortType);
  };

  const safeApplications = applications || [];
  const filteredApplications = useFilteredApplications(
    safeApplications,
    activeFilters,
    activeSort
  );

  const defaultStatusCounts = useMemo(() => ({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0,
    ...statusCounts
  }), [statusCounts]);

  return {
    selectedId,
    activeFilters,
    activeSort,
    isMapView,
    setIsMapView,
    postcode,
    coordinates,
    isLoading: isLoadingCoords || isLoadingApps,
    applications: safeApplications,
    filteredApplications,
    statusCounts: defaultStatusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};