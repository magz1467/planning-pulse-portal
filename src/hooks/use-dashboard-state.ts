import { useState, useEffect } from "react";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { SortType } from "./use-application-sorting";
import { useURLState } from "./use-url-state";
import { useSelectionState } from "./use-selection-state";
import { useFilterState } from "./use-filter-state";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardState = () => {
  const { 
    initialPostcode, 
    initialTab, 
    initialFilter,
    initialApplicationId,
    updateURLParams 
  } = useURLState();

  const { selectedId, handleMarkerClick } = useSelectionState(initialApplicationId);
  const { activeFilters, handleFilterChange } = useFilterState(initialFilter);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(initialPostcode);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint,
    statusCounts
  } = useApplicationsData();

  useEffect(() => {
    updateURLParams({
      postcode,
      tab: initialTab,
      filter: activeFilters.status,
      applicationId: selectedId
    });
  }, [postcode, initialTab, activeFilters.status, selectedId, updateURLParams]);

  const logSearch = async (loadTime: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('Searches').insert({
        'Post Code': postcode,
        'Status': initialTab,
        'User_logged_in': !!session?.user,
        'load_time': loadTime
      });

      if (error) {
        console.error('Error logging search:', error);
      }
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

  const handlePostcodeSelect = async (newPostcode: string) => {
    setSearchStartTime(Date.now());
    setPostcode(newPostcode);
  };

  const handleSortChange = (sortType: SortType) => {
    setActiveSort(sortType);
  };

  // Only fetch applications when coordinates change due to a postcode change
  useEffect(() => {
    // Only fetch if we have coordinates and no existing search point
    if (coordinates && !searchPoint) {
      console.log('Initial fetch with coordinates:', coordinates);
      setSearchPoint(coordinates);
      fetchApplicationsInRadius(coordinates, 1000);
    }
  }, [coordinates, searchPoint, fetchApplicationsInRadius, setSearchPoint]);

  // Log search performance
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000;
      logSearch(loadTime);
      setSearchStartTime(null);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime]);

  const selectedApplication = applications?.find(app => app.id === selectedId);
  const isLoading = isLoadingCoords || isLoadingApps;

  const safeApplications = applications || [];
  
  const filteredApplications = useFilteredApplications(
    safeApplications,
    activeFilters,
    activeSort
  );

  return {
    selectedId,
    selectedApplication,
    activeFilters,
    activeSort,
    isMapView,
    setIsMapView,
    postcode,
    coordinates,
    isLoading,
    applications: safeApplications,
    filteredApplications,
    statusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};