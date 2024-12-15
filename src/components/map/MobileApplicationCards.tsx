import { Application } from "@/types/planning";
import { useState } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [isOpen, setIsOpen] = useState(true);

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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="fixed bottom-0 left-0 right-0 h-1 bg-transparent" />
      <SheetContent side="bottom" className="h-[40vh] p-0 pt-2">
        <div className="flex flex-col h-full">
          <div className="p-2 border-b">
            <div 
              className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" 
              onClick={() => setIsOpen(false)}
            />
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
        </div>
      </SheetContent>
    </Sheet>
  );
};