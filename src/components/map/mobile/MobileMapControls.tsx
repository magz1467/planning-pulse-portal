import { Application } from "@/types/planning";
import { MapAction, SortType } from "@/types/map-reducer";
import { FilterControls } from "../filter/FilterControls";

interface MobileMapControlsProps {
  applications: Application[];
  dispatch: React.Dispatch<MapAction>;
  activeSort: SortType;
  isMapView: boolean;
  onToggleView: () => void;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const MobileMapControls = ({
  applications,
  dispatch,
  activeSort,
  isMapView,
  onToggleView,
  statusCounts
}: MobileMapControlsProps) => {
  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Filter changed:', filterType, value);
  };

  const handleSortChange = (sortType: SortType) => {
    dispatch({ type: 'SET_SORT', payload: sortType });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm">
      <FilterControls
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={{}}
        activeSort={activeSort}
        isMobile={true}
        applications={applications}
        isMapView={isMapView}
        onToggleView={onToggleView}
        statusCounts={statusCounts}
      />
    </div>
  );
};