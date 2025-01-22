import { Application } from "@/types/planning";
import { FilterBar } from "@/components/FilterBar";
import { AlertSection } from "./sidebar/AlertSection";
import { SortType } from "@/hooks/use-sort-applications";
import { ApplicationListView } from "./sidebar/ApplicationListView";

export interface DesktopSidebarProps {
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
  onDismiss: () => void;
}

export const DesktopSidebar = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  onFilterChange,
  onSortChange,
  activeFilters,
  activeSort,
  onDismiss
}: DesktopSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <AlertSection 
        postcode={postcode} 
        onShowEmailDialog={onShowEmailDialog} 
      />
      
      <ApplicationListView
        applications={applications}
        selectedApplication={selectedApplication}
        postcode={postcode}
        onSelectApplication={onSelectApplication}
        onShowEmailDialog={onShowEmailDialog}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        onDismiss={onDismiss}
      />
    </div>
  );
};