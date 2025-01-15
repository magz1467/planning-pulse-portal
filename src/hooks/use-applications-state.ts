import { useState, useEffect } from 'react';
import { Application } from '@/types/planning';
import { useApplicationsData } from '@/components/applications/dashboard/hooks/useApplicationsData';
import { useFilteredApplications } from './use-filtered-applications';
import { SortType } from './use-sort-applications';
import { useToast } from './use-toast';
import { LatLngTuple } from 'leaflet';

export const useApplicationsState = (coordinates: LatLngTuple | null) => {
  const [searchPoint, setSearchPoint] = useState<LatLngTuple | null>(null);
  const { toast } = useToast();
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    statusCounts
  } = useApplicationsData();

  const [activeSort, setActiveSort] = useState<SortType>(null);

  const handleSortChange = (sortType: SortType) => {
    console.log('Changing sort to:', sortType);
    setActiveSort(sortType);
  };

  // Only search when coordinates actually change
  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  useEffect(() => {
    if (!coordinates) return;
    
    if (isInitialSearch || isNewSearch) {
      console.log('Fetching applications with coordinates:', coordinates);
      try {
        const tuple: LatLngTuple = [coordinates[0], coordinates[1]];
        setSearchPoint(tuple);
        fetchApplicationsInRadius(tuple, 1000).catch(error => {
          console.error('Error fetching applications:', error);
          toast({
            title: "Error fetching applications",
            description: "There was a problem loading the planning applications. Please try again.",
            variant: "destructive",
          });
        });
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [coordinates, isInitialSearch, isNewSearch, fetchApplicationsInRadius, toast]);

  return {
    applications,
    isLoadingApps,
    activeSort,
    handleSortChange,
    statusCounts
  };
};