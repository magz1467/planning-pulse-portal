import { PostcodeSearch } from "@/components/PostcodeSearch";
import { FilterBar } from "@/components/FilterBar";

interface SearchSectionProps {
  onPostcodeSelect: (postcode: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: 'closingSoon' | 'newest' | null;
  isMapView?: boolean;
  onToggleView?: () => void;
}

export const SearchSection = ({
  onPostcodeSelect,
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  isMapView,
  onToggleView
}: SearchSectionProps) => {
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <PostcodeSearch 
          onSelect={onPostcodeSelect}
          placeholder="Search new location"
          className="w-full max-w-xl mx-auto"
        />
      </div>

      {onFilterChange && (
        <FilterBar 
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort}
          isMapView={isMapView}
          onToggleView={onToggleView}
        />
      )}
    </>
  );
};