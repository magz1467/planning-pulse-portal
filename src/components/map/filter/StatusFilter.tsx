import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Application } from "@/types/planning";
import { FilterDropdown } from "./FilterDropdown";

interface StatusFilterProps {
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  applications?: Application[];
  isMobile: boolean;
}

export const StatusFilter = ({
  onFilterChange,
  activeFilters = {},
  applications = [],
  isMobile
}: StatusFilterProps) => {
  // Initialize counts with explicit values
  const statusCounts = {
    "Under Review": 0,
    "Approved": 0,
    "Declined": 0,
    "Other": 0
  };

  // Calculate counts from applications
  applications.forEach(app => {
    if (!app?.status) {
      statusCounts['Other']++;
      return;
    }

    const status = app.status.trim();
    if (status.toLowerCase().includes('under review') || status.toLowerCase().includes('under consideration')) {
      statusCounts['Under Review']++;
    } else if (status.toLowerCase().includes('approved')) {
      statusCounts['Approved']++;
    } else if (status.toLowerCase().includes('declined') || status.toLowerCase().includes('refused')) {
      statusCounts['Declined']++;
    } else {
      statusCounts['Other']++;
    }
  });

  console.log('Status counts:', statusCounts);

  return (
    <FilterDropdown
      onFilterChange={onFilterChange}
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
};