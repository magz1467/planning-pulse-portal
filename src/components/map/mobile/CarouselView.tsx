import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from "@/types/planning";

interface CarouselViewProps {
  applications: Application[];
  selectedId?: number | null;
  onSelectApplication: (id: number) => void;
}

export const CarouselView = ({
  applications,
  selectedId,
  onSelectApplication,
}: CarouselViewProps) => {
  return (
    <div className="p-2">
      <Carousel
        opts={{
          align: "center",
        }}
      >
        <CarouselContent>
          {applications.map((application) => (
            <CarouselItem key={application.id} className="basis-4/5 md:basis-1/2">
              <ApplicationCard
                application={application}
                isSelected={selectedId === application.id}
                onClick={() => onSelectApplication(application.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};