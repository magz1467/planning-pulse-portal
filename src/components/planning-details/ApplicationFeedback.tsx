import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building } from "lucide-react";

interface ApplicationFeedbackProps {
  feedback: 'yimby' | 'nimby' | null;
  onFeedback: (type: 'yimby' | 'nimby') => void;
  feedbackStats: {
    yimbyCount: number;
    nimbyCount: number;
  };
}

export const ApplicationFeedback = ({ 
  feedback, 
  onFeedback,
  feedbackStats 
}: ApplicationFeedbackProps) => {
  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <h3 className="font-semibold mb-4">Community Feedback</h3>
      <div className="flex flex-col gap-2">
        <Button
          variant={feedback === 'yimby' ? "default" : "outline"}
          onClick={() => onFeedback('yimby')}
          className="flex items-center gap-2 justify-start"
        >
          <Building className={`h-5 w-5 ${
            feedback === 'yimby' ? 'text-white' : 'text-primary'
          }`} />
          <span className="text-lg font-medium">{feedbackStats.yimbyCount}</span>
          <span className={`text-sm ${
            feedback === 'yimby' ? 'text-white' : 'text-gray-500'
          }`}>people said YIMBY</span>
        </Button>
        <Button
          variant={feedback === 'nimby' ? "outline" : "outline"}
          onClick={() => onFeedback('nimby')}
          className={`flex items-center gap-2 justify-start ${
            feedback === 'nimby' ? 'bg-[#ea384c]/10' : ''
          }`}
        >
          <Home className={`h-5 w-5 ${
            feedback === 'nimby' ? 'text-[#ea384c]' : 'text-gray-600'
          }`} />
          <span className="text-lg font-medium">{feedbackStats.nimbyCount}</span>
          <span className="text-xs text-gray-500">people said NIMBY</span>
        </Button>
      </div>
    </Card>
  );
};