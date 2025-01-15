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

  // Auto-select first application on mobile if none selected
  useEffect(() => {
    if (applications.length > 0 && !selectedId) {
      onSelectApplication(applications[0].id);
    }
  }, [applications, selectedId, onSelectApplication]);

  useEffect(() => {
    if (selectedId === null) {
      setShowFullDetails(false);
    }
  }, [selectedId]);

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
            onSelectApplication(selectedId);
          }}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  }

  if (selectedApp) {
    console.log('📱 MobileApplicationCards - Showing mini card for application:', selectedApp.id);
    return (
      <div className="fixed left-0 right-0 bottom-0 p-4 pb-6 bg-transparent z-50 animate-slide-up">
        <MiniCard
          application={selectedApp}
          onClick={() => setShowFullDetails(true)}
        />
      </div>
    );
  }

  return null;
};