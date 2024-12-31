import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application } from "@/types/planning";
import { ReactNode } from "react";

interface FilterDropdownProps {
  children: ReactNode;
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  applications: Application[];
  isMobile: boolean;
}

const predefinedStatuses = [
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

  // Calculate counts for each status
  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {};
    
    // Initialize counts for predefined statuses
    predefinedStatuses.forEach(status => {
      counts[status.value] = 0;
    });

    // Count applications for each status
    if (applications && applications.length > 0) {
      applications.forEach(app => {
        const appStatus = app.status?.trim() || '';
        
        if (!appStatus) {
          counts['Other']++;
          return;
        }

        const matchedStatus = predefinedStatuses.find(
          status => status.value.toLowerCase() === appStatus.toLowerCase()
        );

        if (matchedStatus) {
          counts[matchedStatus.value]++;
        } else {
          counts['Other']++;
        }
      });
    }

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

        {predefinedStatuses.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange("status", option.value)}
            className="justify-between"
          >
            <span>
              {option.label} ({statusCounts[option.value] || 0})
            </span>
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};