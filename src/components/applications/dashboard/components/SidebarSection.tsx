import { Application } from "@/types/planning";
import { AlertSignup } from "@/components/AlertSignup";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { FilterBar } from "@/components/FilterBar";
import { SortType } from "@/hooks/use-sort-applications";

interface SidebarSectionProps {
  applications: Application[];
  selectedId: number | null;
  postcode: string;
  coordinates: [number, number];
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  isMobile: boolean;
  isMapView: boolean;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  onSelectApplication: (id: number | null) => void;
  onClose: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  applications,
  selectedId,
  postcode,
  coordinates,
  activeFilters,
  activeSort,
  statusCounts,
  isMobile,
  isMapView,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
}) => {
  if (isMobile && isMapView) return null;

  return (
    <div className="w-full md:w-[400px] bg-white border-r overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="p-4 bg-primary-light">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-playfair text-2xl text-primary">Your Feed for Your Area</h2>
              {postcode && <AlertSignup postcode={postcode} />}
            </div>
            <p className="text-sm text-gray-600">
              Showing high-impact developments recently listed near {postcode ? postcode : 'you'}. These applications may significantly affect your neighborhood.
            </p>
          </div>
          <FilterBar 
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
            applications={applications}
            statusCounts={statusCounts}
          />
        </div>
        <PlanningApplicationList
          applications={applications}
          postcode={postcode}
          onSelectApplication={onSelectApplication}
          activeSort={activeSort}
        />
      </div>
    </div>
  );
};