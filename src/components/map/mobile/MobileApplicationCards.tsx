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
  const [showFullDetails, setShowFullDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('📱 MobileApplicationCards - Component mounted/updated:', {
      applicationsCount: applications.length,
      selectedId,
      showFullDetails
    });

    if (selectedId === null) {
      setShowFullDetails(false);
    }
  }, [selectedId, applications.length]);

  const handleCommentSubmit = (content: string) => {
    console.log("💬 New comment:", content);
    toast({
      title: "Comment Submitted",
      description: "Your comment has been recorded",
    });
  };

  const selectedApp = applications.find(app => app.id === selectedId);
  console.log('📱 MobileApplicationCards - Selected application:', {
    selectedId,
    selectedApp,
    applicationsAvailable: applications.length > 0
  });

  if (!applications.length) {
    console.log('📱 MobileApplicationCards - No applications available');
    return <EmptyState />;
  }

  if (showFullDetails && selectedApp) {
    console.log('📱 MobileApplicationCards - Showing full details for application:', selectedApp.id);
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

  if (selectedApp && !showFullDetails) {
    console.log('📱 MobileApplicationCards - Showing mini card for application:', selectedApp.id);
    return (
      <MiniCard
        application={selectedApp}
        onClick={() => setShowFullDetails(true)}
      />
    );
  }

  console.log('📱 MobileApplicationCards - No content to display');
  return null;
};