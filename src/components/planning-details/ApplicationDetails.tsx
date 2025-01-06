import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface ApplicationDetailsProps {
  application?: Application;
}

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Reset expanded state when application changes
  useEffect(() => {
    setIsExpanded(false);
  }, [application?.id]); // Reset when application ID changes
  
  if (!application) return null;

  const isConsultationEndingSoon = isWithinNextSevenDays(application.consultationEnd);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Always visible content */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Key Dates</h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-600">Decision Due:</dt>
          <dd>{application.decisionDue}</dd>
          
          <dt className="text-gray-600">Consultation End:</dt>
          <dd className="flex items-center gap-2">
            {application.consultationEnd}
            {isConsultationEndingSoon && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Ending Soon
              </span>
            )}
          </dd>
        </dl>

        {/* Expandable content */}
        {isExpanded && (
          <dl className="grid grid-cols-2 gap-2 text-sm border-t pt-4 mt-4">
            <dt className="text-gray-600">Reference:</dt>
            <dd>{application.reference}</dd>
            
            <dt className="text-gray-600">Type:</dt>
            <dd>{application.type}</dd>
            
            <dt className="text-gray-600">Applicant:</dt>
            <dd>{application.applicant}</dd>
            
            <dt className="text-gray-600">Submission Date:</dt>
            <dd>{application.submissionDate}</dd>
            
            <dt className="text-gray-600">Ward:</dt>
            <dd>{application.ward}</dd>
            
            <dt className="text-gray-600">Case Officer:</dt>
            <dd>{application.officer}</dd>
          </dl>
        )}
      </div>
    </Card>
  );
};