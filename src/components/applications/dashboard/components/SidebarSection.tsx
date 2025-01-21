import { DashboardLayout } from "./DashboardLayout";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MobileListDetailsView } from "@/components/map/mobile/MobileListDetailsView";
import { Application } from "@/types/planning";

interface SidebarSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  applications: Application[];
  selectedId: number | null;
  postcode: string;
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

export const SidebarSection = ({
  isMobile,
  isMapView,
  applications,
  selectedId,
  postcode,
  coordinates,
  activeFilters,
  activeSort,
  statusCounts,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
}: SidebarSectionProps) => {
  if (isMobile && !isMapView) {
    return (
      <MobileListDetailsView
        applications={applications}
        selectedApplication={selectedId}
        postcode={postcode}
        onSelectApplication={onSelectApplication}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="w-[400px] bg-white border-r overflow-hidden">
      <DesktopSidebar
        applications={applications}
        selectedApplication={selectedId}
        postcode={postcode}
        activeFilters={activeFilters}
        activeSort={activeSort}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onSelectApplication={onSelectApplication}
        onClose={onClose}
        statusCounts={statusCounts}
      />
    </div>
  );
};