import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Bell } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";
import { ImageResolver } from "./components/ImageResolver";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmailDialog } from "@/components/EmailDialog";

interface MobileListContainerProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  onShowEmailDialog: () => void;
  hideFilterBar?: boolean;
  onClose?: () => void;
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
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPostcode, setSelectedPostcode] = useState("");

  if (!applications?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">No planning applications found</p>
        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  const handleEmailSubmit = (radius: string) => {
    setShowEmailDialog(false);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="divide-y">
        {applications.map((application) => (
          <div
            key={application.id}
            className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <ImageResolver
                  imageMapUrl={application.image_map_url}
                  image={application.image}
                  title={application.title || application.description || ''}
                  applicationId={application.id}
                  coordinates={application.coordinates}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <ApplicationTitle 
                    title={application.engaging_title || application.description || ''} 
                    className="mb-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPostcode(application.postcode || postcode);
                      setShowEmailDialog(true);
                    }}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 mt-1 text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <p className="text-sm truncate">{application.address}</p>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <ApplicationBadges
                    status={application.status}
                    lastDateConsultationComments={application.last_date_consultation_comments}
                    impactScore={application.final_impact_score}
                  />
                  <span className="text-xs text-gray-500">{application.distance}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={selectedPostcode}
      />
    </div>
  );
};