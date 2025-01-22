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

  if (showFullDetails && selectedApp) {
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

  if (selectedApp) {
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
  }

  return null;
};