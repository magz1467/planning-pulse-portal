import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Application } from "@/types/planning";
import { useMemo } from "react";
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
  const statusCounts = useMemo(() => {
    const counts = {
      "Under Review": 0,
      "Approved": 0,
      "Declined": 0,
      "Other": 0
    };

    if (!applications?.length) {
      return counts;
    }

    applications.forEach(app => {
      if (!app?.status) {
        counts['Other']++;
        return;
      }

      const status = app.status.trim().toLowerCase();
      if (status.includes('under review') || status.includes('under consideration')) {
        counts['Under Review']++;
      } else if (status.includes('approved')) {
        counts['Approved']++;
      } else if (status.includes('declined') || status.includes('refused')) {
        counts['Declined']++;
      } else {
        counts['Other']++;
      }
    });

    return counts;
  }, [applications]);

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