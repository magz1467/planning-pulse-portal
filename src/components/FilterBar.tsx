import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpDown } from "lucide-react";
import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./map/filter/StatusFilter";
import { ViewToggle } from "./map/filter/ViewToggle";
import { SortType } from "@/hooks/use-sort-applications";

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

export const FilterBar = ({
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

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2 flex-1">
        <StatusFilter
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          isMobile={isMobile}
          applications={applications}
          statusCounts={statusCounts}
        />

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
            {activeSort === 'closingSoon' ? 'Closing Soon' : 
             activeSort === 'newest' ? 'Newest' : 'Sort'}
          </Button>
        </SortDropdown>
      </div>

      {isMobile && onToggleView && (
        <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
      )}
    </div>
  );
};