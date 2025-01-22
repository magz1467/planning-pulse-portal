import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { ApplicationFullScreen } from "./ApplicationFullScreen";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "./EmptyState";
import { MiniCard } from "./MiniCard";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number) => void;
}

export const MobileApplicationCards = ({
  applications,
  selectedId,
  onSelectApplication,
}: MobileApplicationCardsProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedId === null) {
      setShowFullDetails(false);
    }
  }, [selectedId]);

  const handleDismiss = () => {
    setShowFullDetails(false);
    onSelectApplication(null);
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) {
    return <EmptyState />;
  }

  if (showFullDetails && selectedApp) {
    return (
      <ApplicationFullScreen
        application={selectedApp}
        onDismiss={handleDismiss}
      />
    );
  }

  if (selectedApp && !showFullDetails) {
    return (
      <MiniCard
        application={selectedApp}
        onClick={() => setShowFullDetails(true)}
      />
    );
  }

  return null;
};