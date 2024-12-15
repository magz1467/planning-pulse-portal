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
        className="w-full max-w-xs mx-auto relative"
      >
        <CarouselContent>
          {applications.map((app) => (
            <CarouselItem key={app.id} className="basis-full">
              <ApplicationCard
                application={app}
                isSelected={selectedId === app.id}
                onClick={() => onSelectApplication(app.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0" />
        <CarouselNext className="absolute right-0" />
      </Carousel>
    </div>
  );
};