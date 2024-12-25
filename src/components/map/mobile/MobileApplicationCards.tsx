import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./FullScreenDetails";
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

  const handleCommentSubmit = (content: string) => {
    console.log("New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (!applications.length) {
    return <EmptyState />;
  }

  if (showFullDetails && selectedApp) {
    return (
      <div className="fixed inset-0 bg-white z-[2000] animate-in slide-in-from-bottom duration-300">
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