import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { AlertSection } from "./AlertSection";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";
import { SortDropdown } from "../filter/SortDropdown";

interface ApplicationListViewProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  onShowEmailDialog: () => void;
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: 'closingSoon' | 'newest' | null;
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
  statusCounts
}: ApplicationListViewProps) => {
  const [sortedApplications, setSortedApplications] = useState(applications);

  return (
    <div className="flex flex-col h-[calc(100%-56px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between p-2 border-b">
            <FilterBar 
              onFilterChange={onFilterChange}
              activeFilters={activeFilters}
              statusCounts={statusCounts}
            />
            <SortDropdown 
              applications={applications}
              onSortedApplications={setSortedApplications}
            />
          </div>
        </div>
        <AlertSection 
          postcode={postcode}
          onShowEmailDialog={onShowEmailDialog}
        />
        <PlanningApplicationList
          applications={sortedApplications}
          postcode={postcode}
          onSelectApplication={onSelectApplication}
        />
      </div>
    </div>
  );
};