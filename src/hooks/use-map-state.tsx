import { useState, useCallback } from 'react';
import { Application } from '@/types/planning';
import { MapState, MapActions } from '@/types/map';

export const useMapState = (
  coordinates: [number, number] | null,
  applications: Application[],
  isMobile: boolean,
  isMapView: boolean
): MapState & MapActions => {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);

  const handleMarkerClick = useCallback((id: number | null) => {
    setSelectedApplication(id);
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setActiveFilters(prev => {
      // If the value is the same as current, remove the filter
      if (value === prev[filterType]) {
        const newFilters = { ...prev };
        delete newFilters[filterType];
        return newFilters;
      }
      // Otherwise, set the new filter value
      return {
        ...prev,
        [filterType]: value
      };
    });
  }, []);

  const handleSortChange = useCallback((sortType: 'closingSoon' | 'newest' | null) => {
    setActiveSort(prev => sortType === prev ? null : sortType);
  }, []);

  return {
    selectedApplication,
    activeFilters,
    activeSort,
    handleMarkerClick,
    handleFilterChange,
    handleSortChange
  };
};
