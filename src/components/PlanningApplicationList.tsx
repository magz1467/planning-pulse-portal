import { AlertSignup } from "@/components/AlertSignup";
import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number) => void;
}

export const PlanningApplicationList = ({
  applications,
  postcode,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const [feedbackStates, setFeedbackStates] = useState<Record<number, 'up' | 'down' | null>>({});
  const { toast } = useToast();

  const handleFeedback = (id: number, type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    
    setFeedbackStates(prev => {
      if (prev[id] === type) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: type };
    });

    toast({
      title: type === feedbackStates[id] ? "Feedback removed" : "Thank you for your feedback",
      description: type === feedbackStates[id] 
        ? "Your feedback has been removed"
        : type === 'up' 
          ? "We're glad this was helpful!" 
          : "We'll work on improving this",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'declined':
        return 'bg-[#ea384c]/10 text-[#ea384c]';
      case 'under review':
        return 'bg-[#F97316]/10 text-[#F97316]';
      case 'approved':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Planning Applications</h2>
      <AlertSignup postcode={postcode} />
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <h3 className="font-semibold text-primary">{application.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{application.address}</p>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              <span className="text-xs text-gray-500">{application.distance}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Ref: {application.reference}</p>
              <div className="flex gap-2">
                <Button
                  variant={feedbackStates[application.id] === 'up' ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => handleFeedback(application.id, 'up', e)}
                >
                  <ThumbsUp className={`h-4 w-4 ${
                    feedbackStates[application.id] === 'up' ? 'text-white' : 'text-gray-600'
                  }`} />
                </Button>
                <Button
                  variant={feedbackStates[application.id] === 'down' ? "outline" : "outline"}
                  size="sm"
                  onClick={(e) => handleFeedback(application.id, 'down', e)}
                  className={feedbackStates[application.id] === 'down' ? 'bg-[#ea384c]/10' : ''}
                >
                  <ThumbsDown className={`h-4 w-4 ${
                    feedbackStates[application.id] === 'down' ? 'text-[#ea384c]' : 'text-gray-600'
                  }`} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};