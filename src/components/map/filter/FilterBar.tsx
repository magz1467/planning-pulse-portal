import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";
import { FilterBarContent } from "./FilterBarContent";
import { ViewToggle } from "./ViewToggle";

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

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <FilterBarContent
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onToggle={onToggleView}
        activeFilters={activeFilters}
        activeSort={activeSort}
        applications={applications}
        statusCounts={statusCounts}
        isMobile={isMobile}
        isMapView={isMapView}
      />

      {isMobile && onToggleView && (
        <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
      )}
    </div>
  );
};