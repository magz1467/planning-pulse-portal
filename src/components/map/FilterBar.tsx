import { FilterDropdown } from "./filter/FilterDropdown";
import { SortDropdown } from "./filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
}

export const FilterBar = ({ onFilterChange, onSortChange, activeFilters, activeSort }: FilterBarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? "" : "flex gap-4 p-4 bg-white border-b border-gray-200"}`}>
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
  );
};