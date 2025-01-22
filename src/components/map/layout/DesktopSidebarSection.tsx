import { Application } from "@/types/planning";
import { DesktopSidebar } from "../DesktopSidebar";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { SortType } from "@/hooks/use-sort-applications";

interface DesktopSidebarSectionProps {
  isMobile: boolean;
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  onSelectApplication: (id: number) => void;
  onDismiss: () => void;
}

export const DesktopSidebarSection = ({
  isMobile,
  applications,
  selectedApplication,
  postcode,
  activeFilters,
  activeSort,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onDismiss
}: DesktopSidebarSectionProps) => {
  if (isMobile) return null;

  const selectedApp = applications.find(app => app.id === selectedApplication);

  return (
    <div className="w-[400px] flex-shrink-0 border-r bg-white overflow-y-auto">
      {selectedApp ? (
        <PlanningApplicationDetails
          application={selectedApp}
          onDismiss={onDismiss}
        />
      ) : (
        <DesktopSidebar
          applications={applications}
          selectedApplication={selectedApplication}
          postcode={postcode}
          activeFilters={activeFilters}
          activeSort={activeSort}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onSelectApplication={onSelectApplication}
          onShowEmailDialog={() => {}}
          onDismiss={onDismiss}
        />
      )}
    </div>
  );
};