import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

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
          className={`flex items-center gap-2 justify-start h-auto p-2 ${
            feedback === 'yimby' ? 'bg-primary hover:bg-primary-dark' : 'hover:bg-primary/10'
          }`}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <ImageWithFallback
              src="/lovable-uploads/34f1334d-97ed-4c93-9cc7-4aa462946fa1.png"
              alt="YIMBY"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium">{feedbackStats.yimbyCount}</span>
          <span className={`text-sm ${
            feedback === 'yimby' ? 'text-white' : 'text-gray-500'
          }`}>people said YIMBY</span>
        </Button>
        <Button
          variant={feedback === 'nimby' ? "outline" : "outline"}
          onClick={() => onFeedback('nimby')}
          className={`flex items-center gap-2 justify-start h-auto p-2 ${
            feedback === 'nimby' ? 'bg-[#ea384c]/10' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <ImageWithFallback
              src="/lovable-uploads/4dfbdd6f-07d8-4c20-bd77-0754d1f78644.png"
              alt="NIMBY"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium">{feedbackStats.nimbyCount}</span>
          <span className="text-sm text-gray-500">people said NIMBY</span>
        </Button>
      </div>
    </Card>
  );
};