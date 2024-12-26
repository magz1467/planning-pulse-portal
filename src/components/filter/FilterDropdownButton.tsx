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

interface FilterDropdownButtonProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
}

const statusOptions = [
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Declined", value: "Declined" },
];

const typeOptions = [
  { label: "Conservation Area", value: "Conservation Area" },
  { label: "Listed Building", value: "Listed Building" },
  { label: "New Development", value: "New Development" },
  { label: "Change of Use", value: "Change of Use" },
];

export const FilterDropdownButton = ({
  onFilterChange,
  activeFilters,
}: FilterDropdownButtonProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

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
            <DropdownMenuItem
              onClick={() => {
                onFilterChange("status", "");
                onFilterChange("type", "");
              }}
            >
              Clear all filters
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
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
            {option.label}
            {activeFilters.status === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
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
            {option.label}
            {activeFilters.type === option.value && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};