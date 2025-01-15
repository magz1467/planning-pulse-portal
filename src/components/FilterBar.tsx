import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpDown } from "lucide-react";
import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./map/filter/StatusFilter";
import { ViewToggle } from "./map/filter/ViewToggle";
import { SortType } from "@/hooks/use-sort-applications";
import { useCallback, useMemo, useEffect, useState, memo } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: SortType;
  isMapView?: boolean;
  onToggleView?: () => void;
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const FilterBar = memo(({
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort = null,
  isMapView = true,
  onToggleView,
  applications = [],
  statusCounts
}: FilterBarProps) => {
  const isMobile = useIsMobile();
  const [localActiveSort, setLocalActiveSort] = useState<SortType>(activeSort);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  }, [onFilterChange]);

  const handleSortChange = useCallback((sortType: SortType) => {
    setLocalActiveSort(sortType);
    if (onSortChange) {
      onSortChange(sortType);
    }
  }, [onSortChange]);

  useEffect(() => {
    setLocalActiveSort(activeSort);
  }, [activeSort]);

  const sortButtonText = useMemo(() => {
    if (localActiveSort === 'closingSoon') return 'Closing Soon';
    if (localActiveSort === 'newest') return 'Newest';
    return 'Sort';
  }, [localActiveSort]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2 flex-1">
        <ErrorBoundary>
          <StatusFilter
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
            isMobile={isMobile}
            applications={applications}
            statusCounts={statusCounts}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="flex items-center h-full">
            <SortDropdown
              activeSort={localActiveSort}
              onSortChange={handleSortChange}
            >
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortButtonText}
              </Button>
            </SortDropdown>
          </div>
        </ErrorBoundary>
      </div>

      {isMobile && onToggleView && (
        <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
      )}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';