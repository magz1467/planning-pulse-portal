import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Clock, AlertCircle } from "lucide-react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { format, isValid, parse } from "date-fns";

interface ApplicationTimelineProps {
  application: Application;
}

interface TimelineStage {
  label: string;
  date: string | null;
  status: 'completed' | 'current' | 'upcoming';
  tooltip: string;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'Not available';
  
  // Try parsing different date formats
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

  console.warn(`Unable to parse date: ${dateStr}`);
  return 'Invalid date';
};

export const ApplicationTimeline = ({ application }: ApplicationTimelineProps) => {
  const getStages = (): TimelineStage[] => {
    const today = new Date();
    
    // Parse dates with validation
    const validDate = application.valid_date ? 
      parse(application.valid_date, 'dd/MM/yyyy', new Date()) : null;
    
    const consultationEnd = application.last_date_consultation_comments ? 
      parse(application.last_date_consultation_comments, 'dd/MM/yyyy', new Date()) : null;
    
    const decisionDue = application.decision_target_date ? 
      parse(application.decision_target_date, 'dd/MM/yyyy', new Date()) : null;

    // Log date parsing results for debugging
    console.log('Date parsing results:', {
      validDate: application.valid_date,
      parsedValidDate: validDate,
      consultationEnd: application.last_date_consultation_comments,
      parsedConsultationEnd: consultationEnd,
      decisionDue: application.decision_target_date,
      parsedDecisionDue: decisionDue
    });

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
        date: application.decision_target_date,
        status: decisionDue ? 
          (isValid(decisionDue) && decisionDue < today ? 'completed' : 'upcoming') : 'upcoming',
        tooltip: `Decision due by ${formatDate(application.decision_target_date)}`
      }
    ];
  };

  const stages = getStages();
  const isConsultationEndingSoon = application.last_date_consultation_comments && 
    isWithinNextSevenDays(application.last_date_consultation_comments);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Application Timeline
        </h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded transition-all duration-500"
              style={{ 
                width: `${(stages.filter(s => s.status === 'completed').length / (stages.length - 1)) * 100}%` 
              }}
            />
          </div>

          {/* Stages */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => (
              <TooltipProvider key={stage.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center pt-1">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          stage.status === 'completed' ? 'bg-primary border-primary text-white' :
                          stage.status === 'current' ? 'bg-white border-primary text-primary' :
                          'bg-white border-gray-300 text-gray-300'
                        }`}
                      >
                        {stage.status === 'completed' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        stage.status === 'completed' ? 'text-primary' :
                        stage.status === 'current' ? 'text-primary' :
                        'text-gray-500'
                      }`}>
                        {stage.label}
                      </span>
                      {isConsultationEndingSoon && stage.label === 'Consultation' && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          Ending Soon
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stage.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};