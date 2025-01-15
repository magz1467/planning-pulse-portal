import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { Application } from "@/types/planning";
import { memo, useCallback } from "react";

interface StatusFilterProps {
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  isMobile: boolean;
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const StatusFilter = memo(({
  onFilterChange,
  activeFilters = {},
  isMobile,
  applications = [],
  statusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  }
}: StatusFilterProps) => {
  // Memoize callback to prevent recreation on every render
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  }, [onFilterChange]);

  return (
    <FilterDropdown
      onFilterChange={handleFilterChange}
      activeFilters={activeFilters}
      isMobile={isMobile}
      applications={applications}
      statusCounts={statusCounts}
    >
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filter
      </Button>
    </FilterDropdown>
  );
});

StatusFilter.displayName = 'StatusFilter';