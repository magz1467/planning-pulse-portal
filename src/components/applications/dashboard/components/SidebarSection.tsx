import { Application } from "@/types/planning";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MobileListContainer } from "@/components/map/mobile/MobileListContainer";

interface SidebarSectionProps {
  isMobile: boolean;
  applications: Application[];
  selectedId: number | null;
  postcode: string;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  onSelectApplication: (id: number | null) => void;
  onClose: () => void;
  isMapView: boolean;
  coordinates: [number, number];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const SidebarSection = ({
  isMobile,
  applications,
  selectedId,
  postcode,
  activeFilters,
  activeSort,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
  isMapView,
  coordinates,
  statusCounts,
}: SidebarSectionProps) => {
  if (!coordinates) return null;

  if (!isMobile) {
    return (
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
    );
  }

  if (!isMapView) {
    return (
      <MobileListContainer
        applications={applications}
        selectedApplication={selectedId}
        postcode={postcode}
        onSelectApplication={onSelectApplication}
        onShowEmailDialog={() => {}}
        hideFilterBar={true}
        onClose={onClose}
      />
    );
  }

  return null;
};