import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange?: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort?: 'closingSoon' | 'newest' | null;
}

export const FilterBar = ({ 
  onFilterChange, 
  onSortChange, 
  activeFilters, 
  activeSort 
}: FilterBarProps) => {
  const isMobile = useIsMobile();
  
  const statusOptions = [
    "Under Review",
    "Approved",
    "Declined"
  ];

  const typeOptions = [
    "New Build Residential",
    "New Build Commercial",
    "Extension Residential",
    "Extension Commercial"
  ];

  const hasActiveFilters = activeFilters.status || activeFilters.type;
  const activeFilterText = activeFilters.status || activeFilters.type || "Filter";

  const handleClearFilters = () => {
    onFilterChange("status", "");
    onFilterChange("type", "");
  };

  const getSortButtonText = () => {
    switch (activeSort) {
      case 'closingSoon':
        return 'Closing Soon';
      case 'newest':
        return 'Newest';
      default:
        return 'Sort';
    }
  };

  return (
    <div className={`${isMobile ? "px-3 py-2" : "flex gap-4 p-4 bg-white border-b border-gray-200"}`}>
      <div className="flex gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className={`${isMobile ? 'px-3 flex-1' : 'w-[180px]'} justify-between bg-white`}
            >
              <span className="truncate">{activeFilterText}</span>
              <Filter className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start"
            className="w-[200px] bg-white z-[100]"
          >
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

        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className={`${isMobile ? 'px-3 flex-1' : 'w-[180px]'} justify-between bg-white`}
              >
                <span className="truncate">{getSortButtonText()}</span>
                <ArrowUpDown className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              className="w-[200px] bg-white z-[100]"
            >
              <DropdownMenuItem
                onClick={() => onSortChange(null)}
                className="cursor-pointer"
              >
                Default
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange('closingSoon')}
                className="cursor-pointer"
              >
                Closing Soon
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange('newest')}
                className="cursor-pointer"
              >
                Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};