import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { ApplicationDetails } from "./ApplicationDetails";
import { FilterBar } from "@/components/FilterBar";
import { SortType } from "@/hooks/use-application-sorting";
import { ApplicationListView } from "@/components/map/sidebar/ApplicationListView";

interface SidebarContentProps {
  isMobile: boolean;
  applications: Application[];
  selectedId: number | null;
  postcode: string;
  coordinates: LatLngTuple;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: SortType) => void;
  onSelectApplication: (id: number | null) => void;
  onClose: () => void;
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const SidebarContent = ({
  isMobile,
  applications,
  selectedId,
  postcode,
  coordinates,
  activeFilters,
  activeSort,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
  statusCounts
}: SidebarContentProps) => {
  const selectedApplication = applications.find(app => app.id === selectedId);

  if (!isMobile && selectedApplication) {
    return (
      <ApplicationDetails
        application={selectedApplication}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col">
      {!isMobile && (
        <div className="p-4 border-b">
          <FilterBar
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
            statusCounts={statusCounts}
          />
        </div>
      )}
      <ApplicationListView
        applications={applications}
        selectedApplication={selectedId}
        postcode={postcode}
        onSelectApplication={onSelectApplication}
      />
    </div>
  );
};