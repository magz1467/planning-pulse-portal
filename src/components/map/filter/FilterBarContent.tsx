import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";
import { StatusFilter } from "./StatusFilter";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface FilterBarContentProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: SortType;
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  isMobile: boolean;
}

export const FilterBarContent = ({
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort = null,
  applications = [],
  statusCounts,
  isMobile
}: FilterBarContentProps) => {
  const sortButtonText = activeSort === 'closingSoon' ? 'Closing Soon' 
    : activeSort === 'newest' ? 'Newest' 
    : 'Sort';

  return (
    <div className="flex items-center gap-2 flex-1">
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
        <div className="flex items-center h-full">
          <SortDropdown
            activeSort={activeSort}
            onSortChange={onSortChange}
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
  );
};