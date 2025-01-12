import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { ApplicationImage } from "./ApplicationImage";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({
  application,
  onShowEmailDialog,
}: ApplicationMetadataProps) => {
  const getClassificationColor = (classification: string | null) => {
    if (!classification) return "bg-gray-100 text-gray-800";
    
    const classMap: Record<string, string> = {
      'residential': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-purple-100 text-purple-800',
      'environmental': 'bg-green-100 text-green-800',
      'industrial': 'bg-orange-100 text-orange-800'
    };

    return classMap[classification.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="p-4">
      <div className="w-full mb-4">
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={onShowEmailDialog}
            >
              Get updates
            </Button>
          </div>
          <h2 className="text-xl font-semibold break-words line-clamp-2">{application.title || application.description}</h2>
          <div className="flex items-center gap-2">
            {application.class_3 && (
              <Badge className={`${getClassificationColor(application.class_3)}`}>
                {application.class_3}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{application.address}</p>
          </div>
        </div>
      </div>
      <ApplicationImage application={application} />
    </Card>
  );
};