import { useState, useCallback } from 'react';
import { SortType } from "./use-sort-applications";

export const useMapState = () => {
  const [isMapView, setIsMapView] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>(null);

  const handleMarkerClick = useCallback((id: number | null) => {
    setSelectedId(id);
  }, []);

  const handleSortChange = useCallback((sortType: SortType) => {
    setActiveSort(sortType);
  }, []);

  return {
    isMapView,
    setIsMapView,
    selectedId,
    handleMarkerClick,
    activeSort,
    handleSortChange
  };
};