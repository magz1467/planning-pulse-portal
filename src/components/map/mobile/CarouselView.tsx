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
      >
        <CarouselContent>
          {applications.map((app) => (
            <CarouselItem key={app.id}>
              <ApplicationCard
                application={app}
                isSelected={selectedId === app.id}
                onClick={() => onSelectApplication(app.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};