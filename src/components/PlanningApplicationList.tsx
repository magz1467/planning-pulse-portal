import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";
import { ApplicationCard } from "./applications/cards/ApplicationCard";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  activeSort?: SortType;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
  activeSort
}: PlanningApplicationListProps) => {
  return (
    <div className="divide-y">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onSelect={() => onSelectApplication(application.id)}
        />
      ))}
    </div>
  );
};