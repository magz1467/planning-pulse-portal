import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EmailDialog } from "@/components/EmailDialog";

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
  onSelectApplication: (id: number) => void;
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

  const handleEmailSubmit = (email: string, radius: string) => {
    const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
    toast({
      title: "Subscription pending",
      description: `We've sent a confirmation email to ${email}. Please check your inbox and click the link to confirm your subscription for planning alerts within ${radiusText} of ${postcode}. The email might take a few minutes to arrive.`,
      duration: 5000,
    });
  };

  return (
    <div className="w-full md:w-[400px] h-full overflow-y-auto border-r border-gray-200 bg-white">
      <FilterBar 
        onFilterChange={onFilterChange} 
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
      {selectedApplication === null ? (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed about new planning applications in {postcode}
              </p>
              <Button 
                className="w-full"
                onClick={() => setShowEmailDialog(true)}
              >
                Get Alerts
              </Button>
            </div>
          </div>
          <div className="flex-grow">
            <PlanningApplicationList
              applications={applications}
              postcode={postcode}
              onSelectApplication={onSelectApplication}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between border-b py-2 px-4">
            <h2 className="font-semibold">Planning Application Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <PlanningApplicationDetails
            application={selectedApplicationData!}
            onClose={onClose}
          />
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