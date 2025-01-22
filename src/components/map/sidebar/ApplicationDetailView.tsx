import { Application } from "@/types/planning";
import { DetailHeader } from "./DetailHeader";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { useEffect, useRef } from "react";

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationDetailView = ({
  application,
  onClose,
}: ApplicationDetailViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [application.id]);

  return (
    <div className="h-[calc(100%-56px)] flex flex-col">
      <DetailHeader onClose={onClose} />
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <PlanningApplicationDetails
          application={application}
          onClose={onClose}
        />
      </div>
    </div>
  );
};