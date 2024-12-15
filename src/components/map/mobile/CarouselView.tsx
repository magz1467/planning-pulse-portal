import { Application } from "@/types/planning";
import { ApplicationCard } from "./ApplicationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselViewProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number) => void;
}

export const CarouselView = ({
  applications,
  selectedId,
  onSelectApplication,
}: CarouselViewProps) => {
  return (
    <div className="p-4">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-sm mx-auto relative"
      >
        <CarouselContent>
          {applications.map((app) => (
            <CarouselItem key={app.id}>
              <div className="p-1">
                <ApplicationCard
                  application={app}
                  isSelected={selectedId === app.id}
                  onClick={() => onSelectApplication(app.id)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4" />
        <CarouselNext className="absolute -right-4" />
      </Carousel>
    </div>
  );
};