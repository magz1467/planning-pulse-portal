import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { PropsWithChildren } from "react";

interface FilterDropdownProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  isMobile: boolean;
}

export const FilterDropdown = ({ 
  onFilterChange, 
  activeFilters, 
  isMobile,
  children 
}: PropsWithChildren<FilterDropdownProps>) => {
  const statusOptions = ["Under Review", "Approved", "Declined"];
  const typeOptions = [
    "New Build Residential",
    "New Build Commercial",
    "Extension Residential",
    "Extension Commercial",
  ];

  const hasActiveFilters = activeFilters.status || activeFilters.type;
  const activeFilterText = activeFilters.status || activeFilters.type || "Filter";

  const handleClearFilters = () => {
    onFilterChange("status", "");
    onFilterChange("type", "");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {hasActiveFilters && (
          <>
            <DropdownMenuItem
              onClick={handleClearFilters}
              className="cursor-pointer text-blue-600 font-medium"
            >
              Clear filters
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem disabled className="text-sm font-semibold">
          Status
        </DropdownMenuItem>
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onFilterChange("status", status)}
            className="cursor-pointer"
          >
            {status}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled className="text-sm font-semibold">
          Type
        </DropdownMenuItem>
        {typeOptions.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onFilterChange("type", type)}
            className="cursor-pointer"
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};