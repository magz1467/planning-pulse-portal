import { Application } from "@/types/planning";
import { DesktopSidebar } from "../DesktopSidebar";

interface DesktopSidebarSectionProps {
  isMobile: boolean;
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  onSelectApplication: (id: number | null) => void;
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
}: DesktopSidebarSectionProps) => {
  if (isMobile) return null;

  return (
    <DesktopSidebar
      applications={applications}
      selectedApplication={selectedApplication}
      postcode={postcode}
      activeFilters={activeFilters}
      activeSort={activeSort}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      onSelectApplication={onSelectApplication}
      onClose={() => onSelectApplication(null)}
    />
  );
};