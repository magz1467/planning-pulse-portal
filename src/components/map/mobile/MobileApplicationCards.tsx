import React from 'react';
import { Application } from "@/types/planning";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FullScreenDetails } from "./FullScreenDetails";
import { useToast } from "@/components/ui/use-toast";
import { ChevronUp } from "lucide-react";

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
  const { toast } = useToast();

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!selectedApp) return null;

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0" style={{ zIndex: 1100 }}>
      {isFullScreen ? (
        <Sheet open={true} onOpenChange={() => setIsFullScreen(false)}>
          <SheetContent side="bottom" className="h-[90vh] p-0">
            <FullScreenDetails
              application={selectedApp}
              onClose={() => setIsFullScreen(false)}
              onCommentSubmit={handleCommentSubmit}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <div 
          className="bg-white p-4 rounded-t-xl shadow-lg cursor-pointer"
          onClick={() => setIsFullScreen(true)}
        >
          <div className="flex justify-center mb-2">
            <ChevronUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <h3 className="font-semibold text-primary mb-1">{selectedApp.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedApp.address}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
              {selectedApp.status}
            </span>
            <span className="text-xs text-gray-500">{selectedApp.distance}</span>
          </div>
        </div>
      )}
    </div>
  );
};