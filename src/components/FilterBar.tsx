import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";
import { useCallback, useMemo } from "react";
import { ViewToggle } from "./map/filter/ViewToggle";
import { FilterBarContent } from "./map/filter/FilterBarContent";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  onToggleView?: () => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: SortType;
  isMapView?: boolean;
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const FilterBar = ({
  onFilterChange,
  onSortChange,
  onToggleView,
  activeFilters = {},
  activeSort,
  isMapView,
  applications = [],
  statusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  }
}: FilterBarProps) => {
  const isMobile = useIsMobile();

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  }, [onFilterChange]);

  const handleSortChange = useCallback((sortType: SortType) => {
    if (onSortChange) {
      onSortChange(sortType);
    }
  }, [onSortChange]);

  const memoizedFilterBarContent = useMemo(() => (
    <FilterBarContent
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      activeFilters={activeFilters}
      activeSort={activeSort}
      applications={applications}
      statusCounts={statusCounts}
      isMobile={isMobile}
      isMapView={isMapView}
      onToggle={onToggleView}
    />
  ), [
    handleFilterChange,
    handleSortChange,
    activeFilters,
    activeSort,
    applications,
    statusCounts,
    isMobile,
    isMapView,
    onToggleView
  ]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      {memoizedFilterBarContent}

      {isMobile && onToggleView && (
        <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
      )}
    </div>
  );
};