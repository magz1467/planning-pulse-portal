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
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? undefined : value
    }));
  }, []);

  const handleSortChange = useCallback((sortType: 'closingSoon' | 'newest' | null) => {
    setActiveSort(sortType);
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