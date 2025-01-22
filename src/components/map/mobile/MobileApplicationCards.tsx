import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { MiniCard } from "./MiniCard";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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

  if (selectedApp && !showFullDetails) {
    return (
      <>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <MiniCard
            application={selectedApp}
            onClick={() => setIsDrawerOpen(true)}
          />
          <DrawerContent className="h-[85vh] px-4">
            <DrawerHeader>
              <div className="h-2 w-[100px] rounded-full bg-muted mx-auto mb-4 mt-2" />
            </DrawerHeader>
            <PlanningApplicationList
              applications={applications}
              postcode=""
              onSelectApplication={(id) => {
                onSelectApplication(id);
                setIsDrawerOpen(false);
              }}
              activeSort="newest"
            />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return null;
};