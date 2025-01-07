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
  // First, initialize all URL and router related hooks
  const { 
    initialPostcode, 
    initialTab, 
    initialFilter,
    initialApplicationId,
    updateURLParams 
  } = useURLState();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Then, initialize all state management hooks
  const { selectedId, handleMarkerClick } = useSelectionState(initialApplicationId);
  const { activeFilters, handleFilterChange } = useFilterState(initialFilter);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(initialPostcode || '');
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPoint, setSearchPoint] = useState<[number, number] | null>(null);

  // Initialize data fetching hooks
  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts
  } = useApplicationsData();

  // URL params effect
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

  // Search logging
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

  // Postcode selection handler
  const handlePostcodeSelect = async (newPostcode: string) => {
    if (!newPostcode) return;
    setIsSearching(true);
    setSearchStartTime(Date.now());
    setPostcode(newPostcode);
  };

  // Sort handler
  const handleSortChange = (sortType: SortType) => {
    setActiveSort(sortType);
  };

  // Search effect
  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  useEffect(() => {
    if (!coordinates) return;
    
    if (isInitialSearch || isNewSearch) {
      console.log('Fetching applications with coordinates:', coordinates);
      setSearchPoint(coordinates);
      fetchApplicationsInRadius(coordinates, 1000);
    }
  }, [coordinates, isInitialSearch, isNewSearch, fetchApplicationsInRadius]);

  // Search performance logging
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000;
      logSearch(loadTime);
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime, postcode]);

  // Filter applications
  const safeApplications = applications || [];
  const filteredApplications = useFilteredApplications(
    safeApplications,
    activeFilters,
    activeSort
  );

  // Initialize default status counts
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
    applications: safeApplications,
    filteredApplications,
    statusCounts: defaultStatusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};