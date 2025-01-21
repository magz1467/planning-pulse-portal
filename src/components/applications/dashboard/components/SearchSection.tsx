import { PostcodeSearch } from "@/components/PostcodeSearch";
import { FilterBar } from "@/components/FilterBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";

interface SearchSectionProps {
  onPostcodeSelect: (postcode: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: SortType;
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
  applications,
  statusCounts
}: SearchSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white border-b">
      <div className="p-4">
        <PostcodeSearch 
          onSelect={onPostcodeSelect}
          className="w-full"
        />
      </div>

      {onFilterChange && (
        <div className="w-full">
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