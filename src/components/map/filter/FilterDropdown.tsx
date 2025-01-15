import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { memo, useCallback, useMemo } from 'react';

interface FilterDropdownProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  isMobile: boolean;
  applications?: any[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

const statusOptions = [
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Declined", value: "Declined" },
];

export const FilterDropdown = memo(({
  onFilterChange,
  activeFilters,
  statusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  }
}: FilterDropdownProps) => {
  // COMMENTED FOR DEBUGGING - Remove if error persists
  // const hasActiveFilters = useMemo(() => 
  //   Object.values(activeFilters).some(Boolean), 
  //   [activeFilters]
  // );
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  // COMMENTED FOR DEBUGGING - Remove if error persists
  // const handleFilterChange = useCallback((filterType: string, value: string) => {
  //   onFilterChange(filterType, value);
  // }, [onFilterChange]);
  const handleFilterChange = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
  };

  // COMMENTED FOR DEBUGGING - Remove if error persists
  // const handleClearFilters = useCallback(() => {
  //   onFilterChange("status", "");
  //   onFilterChange("type", "");
  // }, [onFilterChange]);
  const handleClearFilters = () => {
    onFilterChange("status", "");
    onFilterChange("type", "");
  };

  // COMMENTED FOR DEBUGGING - Remove if error persists
  // const statusOptionsWithCounts = useMemo(() => 
  //   statusOptions.map(option => ({
  //     ...option,
  //     count: statusCounts[option.value as keyof typeof statusCounts] || 0
  //   })),
  //   [statusCounts]
  // );
  const statusOptionsWithCounts = statusOptions.map(option => ({
    ...option,
    count: statusCounts[option.value as keyof typeof statusCounts] || 0
  }));

  console.log('FilterDropdown render', { activeFilters, statusCounts }); // Debug log

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex-1",
            hasActiveFilters && "border-primary text-primary"
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start"
        className="w-[200px] bg-white z-[9999]"
      >
        {hasActiveFilters && (
          <>
            <DropdownMenuItem onClick={handleClearFilters}>
              Clear all filters
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => handleFilterChange("status", "")}
          className="justify-between"
        >
          All statuses
          {!activeFilters.status && <span>✓</span>}
        </DropdownMenuItem>
        {statusOptionsWithCounts.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleFilterChange("status", option.value)}
            className="justify-between"
          >
            {option.label} ({option.count})
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

FilterDropdown.displayName = 'FilterDropdown';