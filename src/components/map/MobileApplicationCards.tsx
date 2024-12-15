import { Application } from "@/types/planning";
import { useState } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
    <div className="fixed inset-x-0 bottom-0 z-50">
      <Sheet defaultOpen open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className="w-full h-2 bg-gray-200 rounded-t-lg cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        />
        <SheetContent 
          side="bottom" 
          className="p-0 h-[45vh] rounded-t-xl border-t-0"
        >
          <div className="flex flex-col h-full">
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
    </div>
  );
};