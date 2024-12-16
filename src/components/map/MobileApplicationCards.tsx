import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { FullScreenDetails } from "./mobile/FullScreenDetails";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "./mobile/EmptyState";
import { ApplicationSheet } from "./mobile/ApplicationSheet";

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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedId !== null) {
      setIsOpen(true);
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

  if (selectedApp) {
    return (
      <div className="fixed inset-0 bg-white z-[1100] overflow-auto">
        <FullScreenDetails
          application={selectedApp}
          onClose={() => {
            setIsOpen(false);
            onSelectApplication(null);
          }}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0" style={{ zIndex: 1100 }}>
      <ApplicationSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedApp={selectedApp}
      />
    </div>
  );
};