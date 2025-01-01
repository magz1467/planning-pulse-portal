import { useState } from 'react';
import { LatLngTuple } from 'leaflet';

export const useSearchPoint = () => {
  const [searchPoint, setSearchPoint] = useState<LatLngTuple | null>(null);

  return {
    searchPoint,
    setSearchPoint
  };
};