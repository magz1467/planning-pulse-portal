import { Application } from "@/types/planning";
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
    
    const decisionDue = application.decisionDue ? 
      parse(application.decisionDue, 'dd/MM/yyyy', new Date()) : null;

    // Log date parsing results for debugging
    console.log('Date parsing results:', {
      validDate: application.valid_date,
      parsedValidDate: validDate,
      consultationEnd: application.last_date_consultation_comments,
      parsedConsultationEnd: consultationEnd,
      decisionDue: application.decisionDue,
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
        date: application.decisionDue,
        status: decisionDue ? 
          (isValid(decisionDue) && decisionDue < today ? 'completed' : 'upcoming') : 'upcoming',
        tooltip: `Decision due by ${formatDate(application.decisionDue)}`
      }
    ];
  };

  const stages = getStages();

  return (
    <div className="flex flex-col space-y-4 pt-8 pb-4"> {/* Increased pt-6 to pt-8 for more top padding */}
      <div className="relative">
        {/* Timeline line - now positioned behind circles */}
        <div className="absolute left-[15px] top-[30px] bottom-4 w-0.5 bg-gray-200 -z-10" />
        
        <div className="space-y-8">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-start relative">
              {/* Circle container with higher z-index */}
              <div className="flex-shrink-0 relative z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${stage.status === 'completed' ? 'bg-green-100' : 
                          stage.status === 'current' ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        {stage.status === 'completed' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : stage.status === 'current' ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stage.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium">{stage.label}</h3>
                <p className="text-sm text-gray-500">{formatDate(stage.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};