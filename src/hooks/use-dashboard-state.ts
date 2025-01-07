import { useState, useEffect } from "react";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { SortType } from "./use-application-sorting";
import { useURLState } from "./use-url-state";
import { useSelectionState } from "./use-selection-state";
import { useFilterState } from "./use-filter-state";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useDashboardState = () => {
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
  const [postcode, setPostcode] = useState(initialPostcode);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
    if (isSearching && !coordinates) {
      toast({
        title: "Invalid location",
        description: "We couldn't find that location. Please try another search.",
        variant: "destructive",
      });
      setIsSearching(false);
      navigate("/");
      return;
    }

    updateURLParams({
      postcode,
      tab: initialTab,
      filter: activeFilters.status,
      applicationId: selectedId
    });
  }, [postcode, initialTab, activeFilters.status, selectedId, updateURLParams, coordinates, isSearching, navigate, toast]);

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
    setIsSearching(true);
    setSearchStartTime(Date.now());
    setPostcode(newPostcode);
  };

  const handleSortChange = (sortType: SortType) => {
    setActiveSort(sortType);
  };

  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  useEffect(() => {
    if ((isInitialSearch || isNewSearch) && coordinates) {
      console.log('Fetching applications with coordinates:', coordinates);
      setSearchPoint(coordinates);
      // Ensure coordinates are properly typed as [number, number]
      const [lat, lng] = coordinates;
      fetchApplicationsInRadius([lat, lng], 1000);
    }
  }, [coordinates, isInitialSearch, isNewSearch, fetchApplicationsInRadius, setSearchPoint]);

  // Log search performance
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000; // Convert to seconds
      logSearch(loadTime);
      setSearchStartTime(null);
      setIsSearching(false);
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