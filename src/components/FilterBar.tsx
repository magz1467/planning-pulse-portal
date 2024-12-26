import { Button } from "@/components/ui/button";
import { SortAsc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FilterDropdownButton } from "./filter/FilterDropdownButton";
import { FilterBadges } from "./filter/FilterBadges";

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: 'closingSoon' | 'newest' | null;
}

export const FilterBar = ({
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort,
}: FilterBarProps) => {
  return (
    <div className="flex items-center gap-2 px-2 py-3 border-b bg-white">
      <div className="flex-1 flex items-center gap-2 overflow-hidden">
        <FilterDropdownButton 
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
        />
        <FilterBadges
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex-1",
              activeSort && "border-primary text-primary"
            )}
          >
            <SortAsc className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start"
          className="w-[200px] bg-white z-[9999]"
        >
          <DropdownMenuItem
            onClick={() => onSortChange(null)}
            className="justify-between"
          >
            Default
            {!activeSort && <span>✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSortChange('closingSoon')}
            className="justify-between"
          >
            Closing Soon
            {activeSort === 'closingSoon' && <span>✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSortChange('newest')}
            className="justify-between"
          >
            Newest First
            {activeSort === 'newest' && <span>✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};