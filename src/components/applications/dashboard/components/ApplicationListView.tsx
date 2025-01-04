import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { FilterBar } from "@/components/FilterBar";

interface ApplicationListViewProps {
  applications: Application[];
  onSelectApplication: (id: number) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
}

export const ApplicationListView = ({
  applications,
  onSelectApplication,
  activeFilters,
  activeSort,
  statusCounts,
  onFilterChange,
  onSortChange,
}: ApplicationListViewProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <FilterBar 
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort}
          applications={applications}
          statusCounts={statusCounts}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <PlanningApplicationList
          applications={applications}
          onSelectApplication={onSelectApplication}
        />
      </div>
    </div>
  );
};