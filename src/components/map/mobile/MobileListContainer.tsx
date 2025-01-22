import { Application } from "@/types/planning";
import { MobileListView } from "./MobileListView";
import { MobileDetailsView } from "./MobileDetailsView";
import { useState } from "react";

interface MobileListContainerProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  onShowEmailDialog: () => void;
  hideFilterBar?: boolean;
  onDismiss: () => void;
}

export const MobileListContainer = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  hideFilterBar = false,
  onDismiss,
}: MobileListContainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleSelectApplication = (id: number) => {
    onSelectApplication(id);
    setShowDetails(true);
  };

  const handleDismiss = () => {
    setShowDetails(false);
    onDismiss();
  };

  const selectedApp = applications.find(app => app.id === selectedApplication);

  if (showDetails && selectedApp) {
    return (
      <MobileDetailsView 
        application={selectedApp}
        onDismiss={handleDismiss}
      />
    );
  }

  return (
    <MobileListView
      applications={applications}
      selectedApplication={selectedApplication}
      postcode={postcode}
      onSelectApplication={handleSelectApplication}
      onShowEmailDialog={onShowEmailDialog}
      hideFilterBar={hideFilterBar}
      onDismiss={onDismiss}
    />
  );
};