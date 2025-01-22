import { useState, useEffect } from 'react';
import { Application } from "@/types/planning";
import { SortType, FilterType, StatusCounts } from "@/types/application-types";
import { useApplicationsData } from "@/components/applications/dashboard/hooks/useApplicationsData";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ApplicationState {
  selectedId: number | null;
  activeFilters: FilterType;
  activeSort: SortType;
  isMapView: boolean;
  postcode: string;
  coordinates: [number, number] | null;
  isLoading: boolean;
  applications: Application[];
  filteredApplications: Application[];
  statusCounts: StatusCounts;
}

interface ApplicationStateActions {
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handlePostcodeSelect: (postcode: string) => void;
  handleSortChange: (sortType: SortType) => void;
  setIsMapView: (value: boolean) => void;
}

export const useApplicationState = (initialPostcode = ''): ApplicationState & ApplicationStateActions => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType>({});
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState(initialPostcode);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPoint, setSearchPoint] = useState<[number, number] | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts = {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    }
  } = useApplicationsData();

  const handleMarkerClick = (id: number | null) => {
    setSelectedId(id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      if (value === prev[filterType as keyof FilterType]) {
        const { [filterType as keyof FilterType]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [filterType]: value
      };
    });
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
    setActiveSort(sortType);
  };

  // Handle coordinate updates and fetch applications
  useEffect(() => {
    if (!coordinates) return;
    
    const isInitialSearch = !searchPoint && coordinates;
    const isNewSearch = searchPoint && coordinates && 
      (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

    if (isInitialSearch || isNewSearch) {
      try {
        const [lat, lng] = coordinates;
        const tuple: [number, number] = [lat, lng];
        setSearchPoint(tuple);
        fetchApplicationsInRadius(tuple, 1000);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: "There was a problem fetching planning applications. Please try again.",
          variant: "destructive",
        });
        setIsSearching(false);
      }
    }
  }, [coordinates, searchPoint, fetchApplicationsInRadius, toast]);

  // Handle search completion
  useEffect(() => {
    if (searchStartTime && !isLoadingApps && !isLoadingCoords) {
      setSearchStartTime(null);
      setIsSearching(false);
    }
  }, [isLoadingApps, isLoadingCoords, searchStartTime]);

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
    postcode,
    coordinates,
    isLoading: isLoadingCoords || isLoadingApps,
    applications,
    filteredApplications,
    statusCounts,
    handleMarkerClick,
    handleFilterChange,
    handlePostcodeSelect,
    handleSortChange,
    setIsMapView
  };
};