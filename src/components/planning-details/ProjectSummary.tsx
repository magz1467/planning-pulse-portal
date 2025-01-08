import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { DetailsActions } from "./DetailsActions";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationImage } from "./ApplicationImage";
import { ApplicationHeader } from "./ApplicationHeader";
import { DetailsSections } from "./DetailsSections";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { ApplicationDocuments } from "./ApplicationDocuments";
import { ApplicationSharing } from "./ApplicationSharing";
import { ImpactScoreDetails } from "./impact-score/ImpactScoreDetails";

interface ProjectSummaryProps {
  application: Application;
}

export const ProjectSummary = ({ application }: ProjectSummaryProps) => {
  const details = application.application_details || {};
  const summaryItems = Object.entries(details)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => ({
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: typeof value === 'boolean' ? value : String(value)
    }));

  if (summaryItems.length === 0) return null;

  return (
    <div className="space-y-6">
      <ApplicationImage application={application} />
      <ApplicationHeader application={application} />
      <ApplicationDescription application={application} />
      <DetailsActions application={application} />
      <DetailsSections application={application} />
      <ApplicationTimeline application={application} />
      <ApplicationDocuments application={application} />
      <ApplicationSharing application={application} />
      
      {application.impact_score && (
        <ImpactScoreDetails application={application} />
      )}

      <Card className="p-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
        <div className="space-y-2">
          {summaryItems.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium">
                {typeof value === 'boolean' ? (
                  value ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )
                ) : (
                  value
                )}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};