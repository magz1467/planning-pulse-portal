import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./FullScreenDetails";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { MiniCard } from "./MiniCard";

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

  // Reset full details view when selectedId changes
  useEffect(() => {
    if (selectedId === null) {
      setShowFullDetails(false);
    }
  }, [selectedId]);

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) {
    console.log('MobileApplicationCards - No applications available');
    return <EmptyState />;
  }

  if (showFullDetails && selectedApp) {
    console.log('MobileApplicationCards - Showing full details for application:', selectedApp.id);
    return (
      <div className="fixed inset-0 bg-white z-[2000] overflow-auto">
        <FullScreenDetails
          application={selectedApp}
          onClose={() => {
            setShowFullDetails(false);
            onSelectApplication(null);
          }}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  }

  if (selectedApp) {
    console.log('MobileApplicationCards - Showing mini card for application:', selectedApp.id);
    return (
      <MiniCard
        application={selectedApp}
        onClick={() => setShowFullDetails(true)}
      />
    );
  }

  return null;
};