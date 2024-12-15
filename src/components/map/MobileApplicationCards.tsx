import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { CarouselView } from "./mobile/CarouselView";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number) => void;
}

export const MobileApplicationCards = ({
  applications,
  selectedId,
  onSelectApplication,
}: MobileApplicationCardsProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (selectedId) {
      setIsFullScreen(true);
    }
  }, [selectedId]);

  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      setIsFullScreen(!isFullScreen);
    } else {
      setIsFullScreen(false);
      onSelectApplication(id);
    }
  };

  const handleCommentSubmit = (content: string) => {
    // Handle comment submission
    console.log("New comment:", content);
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          setIsFullScreen(false);
        }
      }}
    >
      <DrawerContent className="fixed inset-x-0 bottom-0 mt-24 rounded-t-[10px]">
        <div className="p-2 border-b">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
        </div>
        
        {isFullScreen && selectedApp ? (
          <FullScreenDetails
            application={selectedApp}
            onClose={() => setIsFullScreen(false)}
            onCommentSubmit={handleCommentSubmit}
          />
        ) : (
          <CarouselView
            applications={applications}
            selectedId={selectedId}
            onSelectApplication={handleCardClick}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};