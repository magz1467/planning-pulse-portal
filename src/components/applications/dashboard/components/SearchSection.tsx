import { PostcodeSearch } from "@/components/PostcodeSearch";
import { FilterBar } from "@/components/FilterBar";
import { Application } from "@/types/planning";

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
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const SearchSection = ({
  onPostcodeSelect,
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  isMapView,
  onToggleView,
  applications = [],
  statusCounts
}: SearchSectionProps) => {
  return (
    <div className="flex flex-col border-b shadow-sm">
      <div className="container mx-auto pl-4 pr-8 py-4">
        <PostcodeSearch 
          onSelect={onPostcodeSelect}
          placeholder="Search new location"
          className="w-full"
        />
      </div>

      {onFilterChange && (
        <div className="px-4">
          <FilterBar 
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
            isMapView={isMapView}
            onToggleView={onToggleView}
            applications={applications}
            statusCounts={statusCounts}
          />
        </div>
      )}
    </div>
  );
};