import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ApplicationCard } from "./ApplicationCard";
import { PlanningApplication } from "@/types/planning";

interface CarouselViewProps {
  applications: PlanningApplication[];
  selectedApplication?: PlanningApplication | null;
  onSelectApplication: (application: PlanningApplication) => void;
}

export const CarouselView = ({
  applications,
  selectedApplication,
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
                isSelected={selectedApplication?.id === application.id}
                onClick={() => onSelectApplication(application)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};