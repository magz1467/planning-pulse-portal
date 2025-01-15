import { memo } from "react";
import { FilterDropdown } from "./FilterDropdown";
import { Application } from "@/types/planning";

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
  onFilterChange = () => {},
  activeFilters = {},
  isMobile = false,
  applications = [],
  statusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  }
}: StatusFilterProps) => {
  console.log('StatusFilter render', { activeFilters, statusCounts }); // Debug log

  return (
    <FilterDropdown
      onFilterChange={onFilterChange}
      activeFilters={activeFilters}
      isMobile={isMobile}
      applications={applications}
      statusCounts={statusCounts}
    />
  );
});

StatusFilter.displayName = 'StatusFilter';