import { Application } from "@/types/planning";
import { MiniCard } from "./MiniCard";

interface ApplicationMiniCardProps {
  application: Application;
  onShowFullDetails: () => void;
}

export const ApplicationMiniCard = ({
  application,
  onShowFullDetails,
}: ApplicationMiniCardProps) => {
  if (!application) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[1000]"
      onClick={onShowFullDetails}
    >
      <MiniCard
        application={application}
        onClick={onShowFullDetails}
      />
    </div>
  );
};