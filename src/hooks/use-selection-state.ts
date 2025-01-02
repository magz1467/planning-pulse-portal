import { useState } from 'react';

export const useSelectionState = (initialApplicationId: number | null) => {
  const [selectedId, setSelectedId] = useState<number | null>(initialApplicationId);

  const handleMarkerClick = (id: number | null) => {
    setSelectedId(id === selectedId ? null : id);
  };

  return {
    selectedId,
    setSelectedId,
    handleMarkerClick
  };
};