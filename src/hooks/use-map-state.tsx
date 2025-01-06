import { useState, useCallback } from 'react';
import { Application } from '@/types/planning';
import { MapState, MapActions } from '@/types/map';
import { SortType } from './use-sort-applications';

export const useMapState = (
  coordinates: [number, number] | null,
  applications: Application[],
  isMobile: boolean,
  isMapView: boolean
): MapState & MapActions => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<SortType | null>(null);

  const handleMarkerClick = useCallback((id: number | null) => {
    setSelectedId(id);
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setActiveFilters(prev => {
      if (value === prev[filterType]) {
        const newFilters = { ...prev };
        delete newFilters[filterType];
        return newFilters;
      }
      return {
        ...prev,
        [filterType]: value
      };
    });
  }, []);

  const handleSortChange = useCallback((sortType: SortType | null) => {
    setActiveSort(prev => sortType === prev ? null : sortType);
  }, []);

  return {
    selectedId,
    activeFilters,
    activeSort,
    handleMarkerClick,
    handleFilterChange,
    handleSortChange
  };
};