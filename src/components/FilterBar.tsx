import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ } from "lucide-react";
import { SortDropdown } from "./map/filter/SortDropdown";
import { StatusFilter } from "./map/filter/StatusFilter";
import { ViewToggle } from "./map/filter/ViewToggle";
import { SortType } from "@/hooks/use-sort-applications";
import { useCallback, useMemo } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort: SortType;
  isMapView?: boolean;
  onToggleView?: () => void;
  applications?: any[];
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
  activeFilters = {},
  activeSort,
  isMapView,
  onToggleView,
  applications = [],
  statusCounts
}: FilterBarProps) => {
  const isMobile = useIsMobile();

  // Memoize handlers to prevent recreation on each render
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    onFilterChange?.(filterType, value);
  }, [onFilterChange]);

  const handleSortChange = useCallback((sortType: SortType) => {
    onSortChange?.(sortType);
  }, [onSortChange]);

  // Memoize computed values
  const sortButtonText = useMemo(() => {
    if (activeSort === 'closingSoon') return 'Closing Soon';
    if (activeSort === 'newest') return 'Newest';
    return 'Sort';
  }, [activeSort]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2">
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
          <SortDropdown
            activeSort={activeSort}
            onSortChange={handleSortChange}
          >
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <ArrowDownAZ className="h-4 w-4" />
              {sortButtonText}
            </Button>
          </SortDropdown>
        </ErrorBoundary>
      </div>

      {onToggleView && (
        <div className="ml-auto">
          <ErrorBoundary>
            <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};