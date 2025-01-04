import { Application } from "@/types/planning";
import { ApplicationListView } from "./ApplicationListView";
import { ApplicationDetails } from "./ApplicationDetails";

interface SidebarContentProps {
  isMobile: boolean;
  isMapView: boolean;
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
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
  onSelectApplication: (id: number | null) => void;
  onClose: () => void;
}

export const SidebarContent = ({
  isMobile,
  isMapView,
  applications,
  selectedId,
  coordinates,
  activeFilters,
  activeSort,
  statusCounts,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
}: SidebarContentProps) => {
  if (!isMobile && !isMapView) return null;

  if (selectedId) {
    const selectedApplication = applications.find(app => app.id === selectedId);
    if (selectedApplication) {
      return (
        <div className="w-full md:w-[400px] bg-white h-full overflow-y-auto">
          <ApplicationDetails
            application={selectedApplication}
            onClose={onClose}
          />
        </div>
      );
    }
  }

  return (
    <div className="w-full md:w-[400px] bg-white h-full overflow-y-auto">
      <ApplicationListView
        applications={applications}
        onSelectApplication={onSelectApplication}
        activeFilters={activeFilters}
        activeSort={activeSort}
        statusCounts={statusCounts}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
      />
    </div>
  );
};