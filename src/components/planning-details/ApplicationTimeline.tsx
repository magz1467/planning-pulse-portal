import { Application } from "@/types/planning";
import { Check, Clock, AlertCircle } from "lucide-react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { format, isValid, parse } from "date-fns";
import { getStatusColor } from "@/utils/statusColors";

interface ApplicationTimelineProps {
  application: Application;
}

interface TimelineStage {
  label: string;
  date: string | null;
  status: 'completed' | 'current' | 'upcoming';
  tooltip: string;
  decisionStatus?: 'approved' | 'refused' | null;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'Not available';
  
  // First try to parse the date directly
  const directDate = new Date(dateStr);
  if (isValid(directDate)) {
    return format(directDate, 'dd MMM yyyy');
  }
  
  // If direct parsing fails, try different formats
  const formats = [
    'dd/MM/yyyy',
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd-MM-yyyy'
  ];

  for (const formatStr of formats) {
    const parsedDate = parse(dateStr, formatStr, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'dd MMM yyyy');
    }
  }

  return 'Invalid date';
};

const getDecisionStatus = (status: string | null): 'approved' | 'refused' | null => {
  if (!status) return null;
  const statusLower = status.toLowerCase();
  if (statusLower.includes('approved') || statusLower.includes('granted')) {
    return 'approved';
  }
  if (statusLower.includes('refused') || statusLower.includes('rejected')) {
    return 'refused';
  }
  return null;
};

export const ApplicationTimeline = ({ application }: ApplicationTimelineProps) => {
  const getStages = (): TimelineStage[] => {
    const today = new Date();
    
    const validDate = application.valid_date ? 
      new Date(application.valid_date) : null;
    
    const consultationEnd = application.last_date_consultation_comments ? 
      new Date(application.last_date_consultation_comments) : null;
    
    const decisionDue = application.decisionDue ? 
      new Date(application.decisionDue) : null;

    const decisionStatus = getDecisionStatus(application.status);

    return [
      {
        label: "Submitted",
        date: application.valid_date,
        status: validDate && isValid(validDate) && validDate < today ? 'completed' : 'upcoming',
        tooltip: `Application submitted on ${formatDate(application.valid_date)}`
      },
      {
        label: "Consultation",
        date: application.last_date_consultation_comments,
        status: consultationEnd ? 
          (isValid(consultationEnd) && consultationEnd < today ? 'completed' : 
           (validDate && isValid(validDate) && validDate < today ? 'current' : 'upcoming')) : 'upcoming',
        tooltip: `Public consultation ends on ${formatDate(application.last_date_consultation_comments)}`
      },
      {
        label: "Decision Due",
        date: application.decisionDue,
        status: decisionDue ? 
          (isValid(decisionDue) && decisionDue < today ? 'completed' : 'upcoming') : 'upcoming',
        tooltip: decisionStatus ? 
          `Application ${decisionStatus}` : 
          `Decision due by ${formatDate(application.decisionDue)}`,
        decisionStatus
      }
    ];
  };

  const stages = getStages();

  return (
    <div className="flex flex-col space-y-2 pt-6 pb-4">
      <div className="relative">
        <div className="absolute left-[15px] top-[24px] bottom-4 w-0.5 bg-gray-200 -z-10" />
        
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-start relative">
              <div className="flex-shrink-0 relative z-10">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${stage.status === 'completed' ? 
                    (stage.decisionStatus === 'approved' ? 'bg-green-100' :
                     stage.decisionStatus === 'refused' ? 'bg-red-100' :
                     'bg-green-100') : 
                    stage.status === 'current' ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {stage.status === 'completed' ? (
                    <Check className={`w-5 h-5 ${
                      stage.decisionStatus === 'approved' ? 'text-green-600' :
                      stage.decisionStatus === 'refused' ? 'text-red-600' :
                      'text-green-600'
                    }`} />
                  ) : stage.status === 'current' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium">{stage.label}</h3>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(stage.date)}
                  </p>
                  {stage.label === "Decision Due" && stage.decisionStatus && (
                    <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                      stage.decisionStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stage.decisionStatus.charAt(0).toUpperCase() + stage.decisionStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};