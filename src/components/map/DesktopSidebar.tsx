import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { FilterBar } from "@/components/FilterBar";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EmailDialog } from "@/components/EmailDialog";
import { AlertSection } from "./sidebar/AlertSection";
import { DetailHeader } from "./sidebar/DetailHeader";

interface DesktopSidebarProps {
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
  onClose: () => void;
}

export const DesktopSidebar = ({
  applications,
  selectedApplication,
  postcode,
  activeFilters,
  activeSort,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
}: DesktopSidebarProps) => {
  const selectedApplicationData = selectedApplication
    ? applications.find((app) => app.id === selectedApplication)
    : null;

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedApplication]);

  const handleEmailSubmit = (email: string, radius: string) => {
    const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
    toast({
      title: "Subscription pending",
      description: `We've sent a confirmation email to ${email}. Please check your inbox and click the link to confirm your subscription for planning alerts within ${radiusText} of ${postcode}. The email might take a few minutes to arrive.`,
      duration: 5000,
    });
  };

  const handleClose = () => {
    onSelectApplication(null);
    onClose();
  };

  return (
    <div className="w-full md:w-[400px] h-full overflow-hidden border-r border-gray-200 bg-white">
      <FilterBar 
        onFilterChange={onFilterChange} 
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
      {selectedApplication === null ? (
        <div className="flex flex-col h-[calc(100%-56px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AlertSection 
              postcode={postcode}
              onShowEmailDialog={() => setShowEmailDialog(true)}
            />
            <PlanningApplicationList
              applications={applications}
              postcode={postcode}
              onSelectApplication={onSelectApplication}
            />
          </div>
        </div>
      ) : (
        <div className="h-[calc(100%-56px)] flex flex-col">
          <DetailHeader onClose={handleClose} />
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <PlanningApplicationDetails
              application={selectedApplicationData!}
              onClose={handleClose}
            />
          </div>
        </div>
      )}

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};