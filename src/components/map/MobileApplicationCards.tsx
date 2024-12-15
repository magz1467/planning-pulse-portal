import { Application, Comment } from "@/types/planning";
import { useState, useEffect } from "react";
import { CarouselView } from "./mobile/CarouselView";
import { FullScreenDetails } from "./mobile/FullScreenDetails";

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
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-[1000] pb-safe">
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
    </div>
  );
};