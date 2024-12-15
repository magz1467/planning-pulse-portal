import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CarouselView } from "./mobile/CarouselView";

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

  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      setIsFullScreen(!isFullScreen);
    } else {
      setIsFullScreen(false);
      onSelectApplication(id);
    }
  };

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) return null;

  return (
    <Drawer open={true}>
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