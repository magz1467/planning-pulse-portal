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
    <div className="p-4 min-h-[200px] relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-sm mx-auto"
      >
        <CarouselContent>
          {applications.map((app) => (
            <CarouselItem key={app.id} className="basis-full pl-4">
              <ApplicationCard
                application={app}
                isSelected={selectedId === app.id}
                onClick={() => onSelectApplication(app.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-2" />
        <CarouselNext className="absolute -right-2" />
      </Carousel>
    </div>
  );
};