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
  { label: "Other", value: "Other" }
];

export const FilterDropdown = ({
  children,
  onFilterChange,
  activeFilters,
  applications,
  isMobile,
}: FilterDropdownProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  // Calculate status counts
  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {};
    const predefinedStatuses = statusOptions.map(opt => opt.value.toLowerCase());

    applications.forEach(app => {
      const status = app.status?.toLowerCase() || '';
      
      if (predefinedStatuses.includes(status)) {
        counts[status] = (counts[status] || 0) + 1;
      } else {
        counts['other'] = (counts['other'] || 0) + 1;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

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
            <span>
              {option.label} ({statusCounts[option.value.toLowerCase()] || 0})
            </span>
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};