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
    <Sheet defaultOpen open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="fixed bottom-0 left-0 right-0 h-2 bg-transparent" />
      <SheetContent 
        side="bottom" 
        className="h-[45vh] p-0 pt-2 fixed bottom-0 left-0 right-0 rounded-t-xl"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-2 border-b">
            <div 
              className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" 
              onClick={() => setIsOpen(false)}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};