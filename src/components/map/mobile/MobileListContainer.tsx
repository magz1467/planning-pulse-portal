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
  onClose: () => void;
}

export const MobileListContainer = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
  onShowEmailDialog,
  hideFilterBar = false,
  onClose,
}: MobileListContainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleSelectApplication = (id: number) => {
    onSelectApplication(id);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    onSelectApplication(null);
  };

  const selectedApp = applications.find(app => app.id === selectedApplication);

  if (showDetails && selectedApp) {
    return (
      <MobileDetailsView 
        application={selectedApp}
        onClose={handleCloseDetails}
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
      onClose={onClose}
    />
  );
};