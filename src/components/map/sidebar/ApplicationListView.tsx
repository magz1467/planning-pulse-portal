import { Application } from "@/types/planning";
import { FilterBar } from "@/components/FilterBar";
import { AlertSection } from "./AlertSection";
import { SortType } from "@/hooks/use-sort-applications";

interface ApplicationListViewProps {
  applications: Application[];
  selectedApplication?: number | null;
  postcode: string;
  onSelectApplication: (id: number) => void;
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
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  statusCounts,
}: ApplicationListViewProps) => {
  return (
    <div className="h-full flex flex-col">
      <AlertSection 
        postcode={postcode} 
        onShowEmailDialog={onShowEmailDialog} 
      />
      
      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-4 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectApplication(app.id)}
          >
            <h3 className="font-semibold text-primary truncate">
              {app.ai_title || app.description}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {app.address}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {app.status}
              </span>
              <span className="text-xs text-gray-500">
                {app.distance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};