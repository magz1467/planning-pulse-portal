import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StatusFilter } from "./StatusFilter"; 
import { SortDropdown } from "./SortDropdown"; 
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { ClassificationFilters } from "./ClassificationFilters";
import { SortType, FilterType, StatusCounts } from "@/types/application-types";

interface FilterControlsProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  activeFilters: FilterType;
  activeSort: SortType;
  isMobile: boolean;
  applications?: any[];
  isMapView: boolean;
  onToggleView?: () => void;
  statusCounts?: StatusCounts;
}

export const FilterControls = ({
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  isMobile,
  applications,
  isMapView,
  onToggleView,
  statusCounts
}: FilterControlsProps) => {
  const sortButtonText = (() => {
    if (activeSort === 'closingSoon') return 'Closing Soon';
    if (activeSort === 'newest') return 'Newest';
    if (activeSort === 'impact') return 'Highest Impact';
    return 'Sort';
  })();

  return (
    <div className="flex overflow-x-auto hide-scrollbar w-full no-wrap">
      <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
        <ErrorBoundary>
          <StatusFilter
            onFilterChange={onFilterChange}
            activeFilters={activeFilters}
            isMobile={isMobile}
            applications={applications}
            statusCounts={statusCounts}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          {isMobile && isMapView ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 whitespace-nowrap"
              onClick={onToggleView}
            >
              <List className="h-4 w-4" />
              Feed
            </Button>
          ) : (
            <SortDropdown
              activeSort={activeSort}
              onSortChange={onSortChange}
            >
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                {sortButtonText}
              </Button>
            </SortDropdown>
          )}
        </ErrorBoundary>

        <ClassificationFilters 
          onFilterChange={onFilterChange}
          activeFilter={activeFilters.classification}
        />
      </div>
    </div>
  );
};