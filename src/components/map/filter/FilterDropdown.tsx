import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application } from "@/types/planning";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  children: React.ReactNode;
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  applications: Application[];
  isMobile: boolean;
}

const statusOptions = [
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Declined", value: "Declined" },
];

const typeOptions = [
  { label: "New Build Residential", value: "New Build Residential" },
  { label: "New Build Commercial", value: "New Build Commercial" },
  { label: "Extension Residential", value: "Extension Residential" },
  { label: "Extension Commercial", value: "Extension Commercial" },
];

export const FilterDropdown = ({
  children,
  onFilterChange,
  activeFilters,
  applications,
  isMobile,
}: FilterDropdownProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  // Calculate counts for each status
  const statusCounts = statusOptions.reduce((acc, { value }) => {
    acc[value] = applications.filter(app => app.status === value).length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate counts for each type
  const typeCounts = typeOptions.reduce((acc, { value }) => {
    acc[value] = applications.filter(app => app.type === value).length;
    return acc;
  }, {} as Record<string, number>);

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
              onClick={() => {
                onFilterChange("status", "");
                onFilterChange("type", "");
              }}
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
          onClick={() => onFilterChange("status", "")}
          className="justify-between"
        >
          All statuses
          {!activeFilters.status && <span>✓</span>}
        </DropdownMenuItem>

        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange("status", option.value)}
            className="justify-between"
          >
            <span>{option.label} ({statusCounts[option.value] || 0})</span>
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled className="text-sm font-semibold">
          Type
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onFilterChange("type", "")}
          className="justify-between"
        >
          All types
          {!activeFilters.type && <span>✓</span>}
        </DropdownMenuItem>

        {typeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange("type", option.value)}
            className="justify-between"
          >
            <span>{option.label} ({typeCounts[option.value] || 0})</span>
            {activeFilters.type === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};