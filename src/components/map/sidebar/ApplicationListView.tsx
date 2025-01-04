import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { SortType } from "@/hooks/use-application-sorting";

interface ApplicationListViewProps {
  applications: Application[];
  onSelectApplication: (id: number) => void;
  activeSort: SortType;
}

export const ApplicationListView = ({
  applications,
  onSelectApplication,
  activeSort,
}: ApplicationListViewProps) => {
  return (
    <div className="h-full overflow-auto">
      <PlanningApplicationList
        applications={applications}
        onSelectApplication={onSelectApplication}
      />
    </div>
  );
};