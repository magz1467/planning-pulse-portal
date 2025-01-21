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
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";

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

  useEffect(() => {
    if (selectedId === null) {
      setShowFullDetails(false);
      setIsDrawerOpen(false);
    }
  }, [selectedId]);

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) {
    return <EmptyState />;
  }

  if (selectedApp) {
    if (showFullDetails) {
      return (
        <div className="fixed inset-0 bg-white z-[2000] overflow-auto">
          <PlanningApplicationDetails
            application={selectedApp}
            onClose={() => {
              setShowFullDetails(false);
              onSelectApplication(null);
            }}
          />
        </div>
      );
    }

    return (
      <>
        <Drawer 
          open={isDrawerOpen} 
          onOpenChange={setIsDrawerOpen}
          modal={false}
          snapPoints={[0.2, 0.5, 0.8, 1]}
          activeSnapPoint={0.2}
        >
          <div 
            className="fixed bottom-0 left-0 right-0 z-[1000] touch-none"
            onClick={() => setShowFullDetails(true)}
          >
            <MiniCard
              application={selectedApp}
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
          
          <DrawerContent 
            className="h-[85vh] px-4 fixed bottom-0 left-0 right-0 z-[1001]"
          >
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
  }

  return null;
};