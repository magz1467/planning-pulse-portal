import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { SortType } from "./use-application-sorting";

export const useDashboardState = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL params or location state
  const initialPostcode = searchParams.get('postcode') || location.state?.postcode || 'SW1A 0AA';
  const initialTab = (searchParams.get('tab') || location.state?.tab || 'recent') as 'recent' | 'completed';
  const initialFilter = searchParams.get('filter') || location.state?.initialFilter;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({
    status: initialFilter || undefined
  });
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(initialPostcode);

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint,
    statusCounts
  } = useApplicationsData();

  // Update URL params when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('postcode', postcode);
    params.set('tab', initialTab);
    if (activeFilters.status) {
      params.set('filter', activeFilters.status);
    }
    setSearchParams(params, { replace: true });
  }, [postcode, initialTab, activeFilters.status, setSearchParams]);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Applying filter:', filterType, value);
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      if (searchPoint) {
        fetchApplicationsInRadius(searchPoint, newFilters);
      }
      return newFilters;
    });
  };

  const handlePostcodeSelect = async (newPostcode: string) => {
    setPostcode(newPostcode);
  };

  const handleSortChange = (sortType: SortType) => {
    console.log('Changing sort to:', sortType);
    setActiveSort(sortType);
  };

  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  if ((isInitialSearch || isNewSearch) && coordinates) {
    setSearchPoint(coordinates);
    fetchApplicationsInRadius(coordinates, activeFilters);
  }

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