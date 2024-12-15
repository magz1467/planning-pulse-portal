import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DesktopSidebarProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  activeFilters: {
    status?: string;
    type?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onSelectApplication: (id: number) => void;
  onClose: () => void;
}

export const DesktopSidebar = ({
  applications,
  selectedApplication,
  postcode,
  activeFilters,
  onFilterChange,
  onSelectApplication,
  onClose,
}: DesktopSidebarProps) => {
  const selectedApplicationData = selectedApplication
    ? applications.find((app) => app.id === selectedApplication)
    : null;

  return (
    <div className="w-full md:w-1/3 overflow-y-auto border-r border-gray-200 bg-white">
      <FilterBar onFilterChange={onFilterChange} activeFilters={activeFilters} />
      {selectedApplication === null ? (
        <PlanningApplicationList
          applications={applications}
          postcode={postcode}
          onSelectApplication={onSelectApplication}
        />
      ) : (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <PlanningApplicationDetails
            application={selectedApplicationData!}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
};