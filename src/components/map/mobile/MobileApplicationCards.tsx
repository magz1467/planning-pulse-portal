import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { MiniCard } from "./MiniCard";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number | null) => void;
}

export const MobileApplicationCards = ({
  applications,
  selectedId,
  onSelectApplication,
}: MobileApplicationCardsProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();

  // Reset states when selection changes
  useEffect(() => {
    if (selectedId === null) {
      setShowFullDetails(false);
      setIsDrawerOpen(false);
    }
  }, [selectedId]);

  // Get selected application if there is one
  const selectedApp = selectedId ? applications.find(app => app.id === selectedId) : null;

  // Handle closing details view
  const handleClose = () => {
    setShowFullDetails(false);
    onSelectApplication(null);
  };

  // Early return for empty state
  if (!applications.length) {
    return <EmptyState />;
  }

  // Early return if no selected app
  if (!selectedApp) return null;

  // Render full details view
  if (showFullDetails) {
    return (
      <div className="fixed inset-0 bg-white z-[2000] overflow-auto">
        <PlanningApplicationDetails
          application={selectedApp}
          onClose={handleClose}
        />
      </div>
    );
  }

  // Render mini card with drawer
  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <div 
          className="fixed bottom-0 left-0 right-0 z-[1000]"
          onClick={() => setShowFullDetails(true)}
        >
          <MiniCard
            application={selectedApp}
            onClick={() => setShowFullDetails(true)}
          />
        </div>
        
        <DrawerContent className="h-[85vh] px-4">
          <DrawerHeader>
            <div className="h-2 w-[100px] rounded-full bg-muted mx-auto mb-4 mt-2" />
            <DrawerTitle className="sr-only">Applications List</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto h-full pb-8">
            <PlanningApplicationList
              applications={applications}
              postcode=""
              onSelectApplication={(id) => {
                onSelectApplication(id);
                setIsDrawerOpen(false);
              }}
              activeSort="newest"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};