import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

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

  const selectedApp = applications.find(app => app.id === selectedId);

  if (isFullScreen && selectedApp) {
    return (
      <div className="fixed inset-0 bg-white z-[1000] overflow-y-auto">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsFullScreen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-primary mb-4">{selectedApp.title}</h2>
          <p className="text-gray-600 mb-4">{selectedApp.address}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-semibold">Reference</p>
              <p className="text-gray-600">{selectedApp.reference}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="text-gray-600">{selectedApp.status}</p>
            </div>
            <div>
              <p className="font-semibold">Type</p>
              <p className="text-gray-600">{selectedApp.type}</p>
            </div>
            <div>
              <p className="font-semibold">Distance</p>
              <p className="text-gray-600">{selectedApp.distance}</p>
            </div>
          </div>
          {selectedApp.description && (
            <div>
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-600 text-sm">{selectedApp.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-[1000] pb-safe">
      <div className="p-2 border-b">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
      </div>
      <div className="p-4">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {applications.map((app) => (
              <CarouselItem key={app.id}>
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedId === app.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleCardClick(app.id)}
                >
                  <h3 className="font-semibold text-primary truncate">
                    {app.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {app.address}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-500">{app.distance}</span>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};