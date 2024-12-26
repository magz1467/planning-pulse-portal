import { Button } from "@/components/ui/button";
import { Filter, SortAsc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);
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

  return (
    <div className="flex items-center gap-2 px-2 py-3 border-b bg-white">
      <div className="flex-1 flex items-center gap-2 overflow-hidden">
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

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            {activeFilters.status && (
              <Badge 
                variant="secondary" 
                className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 border-0 font-medium cursor-pointer whitespace-nowrap"
                onClick={() => onFilterChange("status", "")}
              >
                {activeFilters.status} ×
              </Badge>
            )}
            {activeFilters.type && (
              <Badge 
                variant="secondary" 
                className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 border-0 font-medium cursor-pointer whitespace-nowrap"
                onClick={() => onFilterChange("type", "")}
              >
                {activeFilters.type} ×
              </Badge>
            )}
          </div>
        </div>
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