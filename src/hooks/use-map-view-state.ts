import { useState, useCallback } from 'react';

export const useMapViewState = () => {
  const [isMapView, setIsMapView] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapViewState handleMarkerClick:', id);
    setSelectedId(id);
  }, []);

  return {
    isMapView,
    setIsMapView,
    selectedId,
    handleMarkerClick
  };
};