import { useState } from 'react';

interface FilterState {
  status?: string;
  type?: string;
}

export const useFilterState = (initialFilter?: string) => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    status: initialFilter
  });

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Applying filter:', filterType, value);
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      return newFilters;
    });
  };

  return {
    activeFilters,
    setActiveFilters,
    handleFilterChange
  };
};