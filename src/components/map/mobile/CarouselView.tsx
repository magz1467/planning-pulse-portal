import { Application } from "@/types/planning";
import { ApplicationCard } from "./ApplicationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
          dragFree: true,
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
      </Carousel>
    </div>
  );
};