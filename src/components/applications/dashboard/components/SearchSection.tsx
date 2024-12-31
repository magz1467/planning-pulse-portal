import { PostcodeSearch } from "@/components/PostcodeSearch";
import { FilterBar } from "@/components/FilterBar";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <PostcodeSearch 
          onSelect={onPostcodeSelect}
          placeholder="Search new location"
          className="w-full max-w-xl mx-auto"
        />
      </div>

      {/* Only show FilterBar in mobile view */}
      {isMobile && onFilterChange && (
        <div className="px-4">
          <FilterBar 
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
            isMapView={isMapView}
            onToggleView={onToggleView}
          />
        </div>
      )}
    </div>
  );
};