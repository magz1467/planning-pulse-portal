import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ } from "lucide-react";
import { SortDropdown } from "./map/filter/SortDropdown";
import { StatusFilter } from "./map/filter/StatusFilter";
import { ViewToggle } from "./map/filter/ViewToggle";
import { ClassificationFilters } from "./map/filter/ClassificationFilters";
import { SortType } from "@/hooks/use-sort-applications";
import { useCallback, useMemo } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
    classification?: string;
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

  const sortButtonText = useMemo(() => {
    if (activeSort === 'closingSoon') return 'Closing Soon';
    if (activeSort === 'newest') return 'Newest';
    if (activeSort === 'impact') return 'Highest Impact';
    return 'Sort';
  }, [activeSort]);

  return (
    <div className="flex flex-col bg-white border-b">
      <ClassificationFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilters.classification}
      />
      
      <div className="flex items-center gap-1.5 p-1.5">
        <div className="flex items-center gap-1.5">
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
                className="flex items-center gap-1.5"
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
    </div>
  );
};