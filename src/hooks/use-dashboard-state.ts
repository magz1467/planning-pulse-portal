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
  const [postcode, setPostcode] = useState(initialPostcode || '');
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPoint, setSearchPoint] = useState<[number, number] | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts
  } = useApplicationsData();

  // Auto-select first application on mobile only on initial load and only in map view
  useEffect(() => {
    if (!hasAutoSelected && applications.length > 0 && window.innerWidth <= 768 && !selectedId && isMapView) {
      console.log('Auto-selecting first application on mobile - map view only');
      handleMarkerClick(applications[0].id);
      setHasAutoSelected(true);
    }
  }, [applications, selectedId, hasAutoSelected, handleMarkerClick, isMapView]);

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
  }, [postcode, initialTab, activeFilters.status, selectedId, updateURLParams, coordinates, isSearching, navigate, toast]);

  const logSearch = async (loadTime: number) => {
    try {
      console.log('Logging search with params:', {
        postcode,
        status: initialTab,
        loadTime
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('Searches').insert({
        'Post Code': postcode,
        'Status': initialTab,
        'User_logged_in': !!session?.user,
        'load_time': loadTime
      });

      if (error) {
        console.error('Search logging error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Analytics Error",
          description: "Your search was processed but we couldn't log it. This won't affect your results.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Search logging error:', error);
    }
  };

  const handlePostcodeSelect = async (newPostcode: string) => {
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
  };

  const handleSortChange = (sortType: SortType) => {
    console.log('Changing sort to:', sortType);
    setActiveSort(sortType);
  };

  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  useEffect(() => {
    if (!coordinates) return;
    
    if (isInitialSearch || isNewSearch) {
      console.log('Fetching applications with coordinates:', coordinates);
      try {
        const [lat, lng] = coordinates;
        const tuple: [number, number] = [lat, lng];
        setSearchPoint(tuple);
        fetchApplicationsInRadius(tuple, 1000);
      } catch (error) {
        console.error('Search error:', error);
        console.error('Error details:', {
          message: (error as any).message,
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code
        });
        toast({
          title: "Search Failed",
          description: "There was a problem fetching planning applications. Please try again or contact support if the issue persists.",
          variant: "destructive",
        });
        setIsSearching(false);
      }
    }
  }, [coordinates, isInitialSearch, isNewSearch, fetchApplicationsInRadius, toast]);

  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      const loadTime = (Date.now() - searchStartTime) / 1000;
      logSearch(loadTime);
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime, postcode]);

  const safeApplications = applications || [];
  const filteredApplications = useFilteredApplications(
    safeApplications,
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
    applications: safeApplications,
    filteredApplications,
    statusCounts: defaultStatusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
  };
};