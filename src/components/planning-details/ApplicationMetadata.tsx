import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Building2, House, TreeDeciduous, Factory } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationImage } from "./ApplicationImage";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

const getClassificationDetails = (classification: string | null) => {
  if (!classification) return null;
  
  const classMap: Record<string, { icon: any; label: string; color: string }> = {
    'residential': { 
      icon: House, 
      label: 'Residential',
      color: 'bg-blue-100 text-blue-800'
    },
    'commercial': { 
      icon: Building2, 
      label: 'Commercial',
      color: 'bg-purple-100 text-purple-800'
    },
    'environmental': { 
      icon: TreeDeciduous, 
      label: 'Environmental',
      color: 'bg-green-100 text-green-800'
    },
    'industrial': { 
      icon: Factory, 
      label: 'Industrial',
      color: 'bg-orange-100 text-orange-800'
    }
  };

  const lowerClass = classification.toLowerCase();
  return classMap[lowerClass] || null;
};

export const ApplicationMetadata = ({ application, onShowEmailDialog }: ApplicationMetadataProps) => {
  const classDetails = getClassificationDetails(application.class_3);

  return (
    <Card className="p-4">
      {application.image && (
        <div className="mb-4">
          <ApplicationImage application={application} />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {getStatusText(application.status)}
            </span>
            {classDetails && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${classDetails.color}`}>
                <classDetails.icon className="w-3 h-3" />
                {classDetails.label}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">{application.title || application.description}</h2>
          <h2 className="text-sm font-medium text-gray-900">Reference: {application.reference}</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onShowEmailDialog}
        >
          <Bell className="w-4 h-4" />
          Get updates
        </Button>
      </div>
      <div className="text-sm text-gray-500">
        <p className="mb-1">Submitted: {application.submissionDate}</p>
        <p className="mb-1">Decision due: {application.decisionDue}</p>
        <p>Type: {application.type}</p>
      </div>
    </Card>
  );
};