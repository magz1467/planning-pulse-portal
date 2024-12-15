import { Application } from "@/types/planning";
import { useState } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CarouselView } from "./mobile/CarouselView";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      setIsFullScreen(!isFullScreen);
    } else {
      setIsFullScreen(false);
      onSelectApplication(id);
      toast({
        title: "Application Selected",
        description: "Tap again to view full details",
      });
    }
  };

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) {
    return (
      <div className="fixed bottom-0 left-4 right-4 bg-white p-4 rounded-lg shadow-lg" style={{ zIndex: 1100 }}>
        <p className="text-center text-gray-500">No applications found in this area</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0" style={{ zIndex: 1100 }}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div 
            className="h-1 w-12 bg-gray-200 rounded-full mx-auto mb-1 cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          />
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="p-0 h-[45vh] rounded-t-xl bg-white shadow-lg"
          style={{ position: 'relative' }}
        >
          <div className="flex flex-col h-full bg-white">
            <div className="p-1 border-b bg-white sticky top-0">
              <div 
                className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" 
                onClick={() => setIsOpen(false)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white">
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