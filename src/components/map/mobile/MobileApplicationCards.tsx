import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./FullScreenDetails";
import { useToast } from "@/hooks/use-toast";
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
  console.log("MobileApplicationCards render", { applications, selectedId });
  
  const [showFullDetails, setShowFullDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedId === null) {
      console.log("Selected ID is null, hiding full details");
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
  console.log("Selected application:", selectedApp);

  if (!applications.length) {
    console.log("No applications available");
    return <EmptyState />;
  }

  if (showFullDetails && selectedApp) {
    console.log("Showing full details view");
    return (
      <div className="fixed inset-0 bg-white z-[2000] overflow-auto">
        <FullScreenDetails
          application={selectedApp}
          onClose={() => {
            console.log("Closing full details");
            setShowFullDetails(false);
            onSelectApplication(null);
          }}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  }

  if (selectedApp && !showFullDetails) {
    console.log("Showing mini card");
    return (
      <MiniCard
        application={selectedApp}
        onClick={() => {
          console.log("Mini card clicked, showing full details");
          setShowFullDetails(true);
        }}
      />
    );
  }

  console.log("No content to display");
  return null;
};