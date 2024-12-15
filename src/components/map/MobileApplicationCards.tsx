import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ApplicationCard } from "./mobile/ApplicationCard";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedId) {
      const index = applications.findIndex(app => app.id === selectedId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
      setIsFullScreen(true);
    }
  }, [selectedId, applications]);

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

  const navigateCards = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : applications.length - 1));
    } else {
      setCurrentIndex(prev => (prev < applications.length - 1 ? prev + 1 : 0));
    }
    onSelectApplication(applications[currentIndex].id);
  };

  const selectedApp = applications.find(app => app.id === selectedId);
  const currentApp = applications[currentIndex];

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
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateCards('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1">
                {currentApp && (
                  <ApplicationCard
                    application={currentApp}
                    isSelected={selectedId === currentApp.id}
                    onClick={() => handleCardClick(currentApp.id)}
                  />
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateCards('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};