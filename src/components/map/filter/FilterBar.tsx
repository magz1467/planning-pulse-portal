import React, { useMemo } from 'react';
import { FilterBarContent } from "./FilterBarContent";
import { SortType } from "@/hooks/use-sort-applications";

interface FilterBarProps {
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType;
  isMapView: boolean;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  onToggleView: () => void;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const FilterBar = ({
  activeFilters,
  activeSort,
  isMapView,
  onFilterChange,
  onSortChange,
  onToggleView,
  statusCounts
}: FilterBarProps) => {
  const memoizedContent = useMemo(() => (
    <FilterBarContent
      activeFilters={activeFilters}
      activeSort={activeSort}
      isMapView={isMapView}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      onToggleView={onToggleView}
      statusCounts={statusCounts}
    />
  ), [activeFilters, activeSort, isMapView, onFilterChange, onSortChange, onToggleView, statusCounts]);

  return (
    <div className="sticky top-0 z-10 bg-background">
      {memoizedContent}
    </div>
  );
};