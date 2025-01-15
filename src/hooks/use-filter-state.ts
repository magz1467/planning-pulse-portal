import { useState, useCallback } from 'react';

export const useFilterState = (initialFilter?: string) => {
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({ status: initialFilter });

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  return {
    activeFilters,
    handleFilterChange
  };
};