import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application } from "@/types/planning";
import { memo, useCallback, useMemo } from "react";

interface FilterDropdownProps {
  children: React.ReactNode;
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  applications: Application[];
  isMobile: boolean;
  statusCounts: { [key: string]: number };
  isLoading?: boolean;
}

const predefinedStatuses = [
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Declined", value: "Declined" },
  { label: "Other", value: "Other" }
];

export const FilterDropdown = memo(({
  children,
  onFilterChange,
  activeFilters,
  applications,
  isMobile,
  statusCounts,
  isLoading = false
}: FilterDropdownProps) => {
  // Memoize expensive computations
  const hasActiveFilters = useMemo(() => 
    Object.values(activeFilters).some(Boolean),
    [activeFilters]
  );

  // Memoize callback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    onFilterChange(filterType, value);
  }, [onFilterChange]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start"
        className="w-[280px] bg-white z-[9999]"
      >
        {hasActiveFilters && (
          <>
            <DropdownMenuItem
              onClick={() => handleFilterChange("status", "")}
              className="text-blue-600 font-medium"
            >
              Clear filters
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem disabled className="text-sm font-semibold">
          Status
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleFilterChange("status", "")}
          className="justify-between"
        >
          All statuses
          {!activeFilters.status && <span>✓</span>}
        </DropdownMenuItem>

        {predefinedStatuses.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleFilterChange("status", option.value)}
            className="justify-between"
          >
            <span>
              {option.label} ({isLoading ? '...' : statusCounts[option.value] || 0})
            </span>
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

FilterDropdown.displayName = 'FilterDropdown';