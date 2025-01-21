import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StatusFilter } from "./StatusFilter";
import { SortDropdown } from "./SortDropdown";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ } from "lucide-react";
import { ClassificationFilters } from "./ClassificationFilters";
import { SortType } from "@/hooks/use-sort-applications";

interface FilterControlsProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  activeFilters: {
    status?: string;
    type?: string;
    classification?: string;
  };
  activeSort: SortType;
  isMobile: boolean;
  applications?: any[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const FilterControls = ({
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  isMobile,
  applications,
  statusCounts
}: FilterControlsProps) => {
  const sortButtonText = (() => {
    if (activeSort === 'closingSoon') return 'Closing Soon';
    if (activeSort === 'newest') return 'Newest';
    if (activeSort === 'impact') return 'Highest Impact';
    return 'Sort';
  })();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
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
        <SortDropdown
          activeSort={activeSort}
          onSortChange={onSortChange}
        >
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <ArrowDownAZ className="h-4 w-4" />
            {sortButtonText}
          </Button>
        </SortDropdown>
      </ErrorBoundary>

      <ClassificationFilters 
        onFilterChange={onFilterChange}
        activeFilter={activeFilters.classification}
      />
    </div>
  );
};