import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/components/map/filter/FilterDropdown";
import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: 'closingSoon' | 'newest' | null) => void;
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
  activeSort = null,
}: FilterBarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2">
        <FilterDropdown
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          isMobile={isMobile}
        />
        <SortDropdown
          onSortChange={onSortChange}
          activeSort={activeSort}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};