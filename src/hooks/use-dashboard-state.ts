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

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
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
    setPostcode(newPostcode);
  };

  const handleSortChange = (sortType: SortType) => {
    setActiveSort(sortType);
  };

  // Only fetch applications when coordinates change
  useEffect(() => {
    if (coordinates) {
      console.log('Fetching applications with coordinates:', coordinates);
      fetchApplicationsInRadius(coordinates, 1000);
    }
  }, [coordinates, fetchApplicationsInRadius]);

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