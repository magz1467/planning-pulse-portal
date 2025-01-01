import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";

export const useDashboardState = () => {
  const location = useLocation();
  const searchPostcode = location.state?.postcode;
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(searchPostcode || 'SW1A 0AA');

  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint,
    statusCounts
  } = useApplicationsData();

  console.log('DashboardState - Active sort:', activeSort);
  console.log('DashboardState - Raw applications:', applications?.length);

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

  const handleSortChange = (sortType: 'closingSoon' | 'newest' | null) => {
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
  
  // Get filtered and sorted applications
  const filteredApplications = useFilteredApplications(
    safeApplications,
    activeFilters,
    activeSort
  );

  console.log('DashboardState - Filtered applications:', filteredApplications?.length);

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