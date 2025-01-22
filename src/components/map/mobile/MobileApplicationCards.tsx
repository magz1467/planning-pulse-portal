import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { ApplicationMiniCard } from "./ApplicationMiniCard";
import { ApplicationFullScreen } from "./ApplicationFullScreen";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number | null) => void;
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

  const handleClose = () => {
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
        onClose={handleClose}
      />
    );
  }

  if (selectedApp) {
    return (
      <ApplicationMiniCard
        application={selectedApp}
        onShowFullDetails={() => setShowFullDetails(true)}
      />
    );
  }

  return null;
};