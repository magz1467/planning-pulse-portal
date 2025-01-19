import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { AlertSection } from "./AlertSection";
import { FilterBar } from "@/components/FilterBar";
import { SortType } from "@/hooks/use-sort-applications";

interface ApplicationListViewProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  onShowEmailDialog: () => void;
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: SortType) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: SortType;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const ApplicationListView = ({
  applications,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  onFilterChange,
  activeFilters = {},
  onSortChange,
  activeSort,
  statusCounts
}: ApplicationListViewProps) => {
  return (
    <div className="flex flex-col h-[calc(100%-56px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="p-4 bg-primary/5 border-b">
            <h2 className="font-playfair text-2xl text-primary mb-2">Your Feed for Your Area</h2>
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
        <AlertSection 
          postcode={postcode}
          onShowEmailDialog={onShowEmailDialog}
        />
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