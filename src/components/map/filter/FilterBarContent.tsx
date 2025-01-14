import React, { useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { ViewToggle } from "./ViewToggle";
import { StatusFilter } from "./StatusFilter";
import { SortType } from "@/hooks/use-sort-applications";

interface FilterBarContentProps {
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

export const FilterBarContent = React.memo(({
  activeFilters,
  activeSort,
  isMapView,
  onFilterChange,
  onSortChange,
  onToggleView,
  statusCounts
}: FilterBarContentProps) => {
  
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    onFilterChange(filterType, value);
  }, [onFilterChange]);

  const handleSortChange = useCallback((sortType: SortType) => {
    onSortChange(sortType);
  }, [onSortChange]);

  const handleViewToggle = useCallback(() => {
    onToggleView();
  }, [onToggleView]);

  const memoizedStatusCounts = useMemo(() => ({
    'Under Review': statusCounts?.['Under Review'] || 0,
    'Approved': statusCounts?.['Approved'] || 0,
    'Declined': statusCounts?.['Declined'] || 0,
    'Other': statusCounts?.['Other'] || 0
  }), [statusCounts]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-background border-b">
      <div className="flex-1 flex items-center gap-2">
        <StatusFilter 
          activeStatus={activeFilters.status}
          onStatusChange={(status) => handleFilterChange('status', status)}
          statusCounts={memoizedStatusCounts}
        />
        <FilterDropdown 
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
        <SortDropdown
          activeSort={activeSort}
          onSortChange={handleSortChange}
        />
      </div>
      <ViewToggle 
        isMapView={isMapView}
        onToggleView={handleViewToggle}
      />
    </div>
  );
});

FilterBarContent.displayName = 'FilterBarContent';