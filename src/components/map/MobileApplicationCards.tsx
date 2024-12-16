import React from 'react';
import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Update isOpen when selectedId changes
  useEffect(() => {
    if (selectedId !== null) {
      setIsOpen(true);
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
    return (
      <div className="fixed bottom-0 left-4 right-4 bg-white p-4 rounded-lg shadow-lg mb-1" style={{ zIndex: 1100 }}>
        <p className="text-center text-gray-500">No applications found in this area</p>
      </div>
    );
  }

  if (selectedApp) {
    return (
      <div className="fixed inset-0 bg-white z-[1100] overflow-auto">
        <FullScreenDetails
          application={selectedApp}
          onClose={() => {
            setIsOpen(false);
            onSelectApplication(null);
          }}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0" style={{ zIndex: 1100 }}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div 
            className="h-1 w-12 bg-gray-200 rounded-full mx-auto mb-0.5 cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          />
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="p-0 h-[45vh] rounded-t-xl bg-white shadow-lg"
          style={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="flex flex-col h-full bg-white">
            <div className="p-0.5 border-b bg-white sticky top-0">
              <div 
                className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" 
                onClick={() => setIsOpen(false)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white">
              {selectedApp && (
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <h3 className="font-semibold text-primary">{selectedApp.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedApp.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                      {selectedApp.status}
                    </span>
                    <span className="text-xs text-gray-500">{selectedApp.distance}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};