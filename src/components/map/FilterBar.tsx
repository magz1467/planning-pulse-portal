import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
}

export const FilterBar = ({ onFilterChange, activeFilters }: FilterBarProps) => {
  const statusOptions = ["Under Review", "Approved", "Declined"];
  const typeOptions = [
    "New Build Residential",
    "New Build Commercial",
    "Extension Residential",
    "Extension Commercial",
  ];
  const isMobile = useIsMobile();

  const handleClearFilters = () => {
    onFilterChange("status", "");
    onFilterChange("type", "");
  };

  const hasActiveFilters = activeFilters.status || activeFilters.type;
  const activeFilterText = activeFilters.status || activeFilters.type || "Filter";

  return (
    <div className={isMobile ? "" : "flex gap-4 p-4 bg-white border-b border-gray-200"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className={`${isMobile ? 'px-3' : 'w-[180px]'} justify-between`}
          >
            <span className="truncate">{activeFilterText}</span>
            <Filter className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
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
    </div>
  );
};