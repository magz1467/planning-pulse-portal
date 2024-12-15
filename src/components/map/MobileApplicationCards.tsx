import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
                  onClick={() => onSelectApplication(app.id)}
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