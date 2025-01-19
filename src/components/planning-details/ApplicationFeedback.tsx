import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className="p-4 hover:border-primary transition-colors">
        <h3 className="font-semibold mb-4">Community Feedback</h3>
        <div className="flex justify-between gap-2">
          <Button
            variant={feedback === 'yimby' ? "default" : "outline"}
            onClick={() => onFeedback('yimby')}
            className={`flex items-center gap-2 flex-1 ${
              feedback === 'yimby' ? 'bg-primary hover:bg-primary-dark' : 'hover:bg-primary/10'
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src="/lovable-uploads/3df4c01a-a60f-43c5-892a-18bf170175b6.png"
                alt="YIMBY"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm">{feedbackStats.yimbyCount}</span>
          </Button>
          <Button
            variant={feedback === 'nimby' ? "outline" : "outline"}
            onClick={() => onFeedback('nimby')}
            className={`flex items-center gap-2 flex-1 ${
              feedback === 'nimby' ? 'bg-[#ea384c]/10' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src="/lovable-uploads/4dfbdd6f-07d8-4c20-bd77-0754d1f78644.png"
                alt="NIMBY"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm">{feedbackStats.nimbyCount}</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <h3 className="font-semibold mb-4">Community Feedback</h3>
      <div className="flex gap-4">
        <Button
          variant={feedback === 'yimby' ? "default" : "outline"}
          onClick={() => onFeedback('yimby')}
          className={`flex-1 flex items-center gap-3 justify-start h-auto p-3 ${
            feedback === 'yimby' ? 'bg-primary hover:bg-primary-dark' : 'hover:bg-primary/10'
          }`}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src="/lovable-uploads/3df4c01a-a60f-43c5-892a-18bf170175b6.png"
              alt="YIMBY"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium">{feedbackStats.yimbyCount}</span>
            <span className={`text-sm ${
              feedback === 'yimby' ? 'text-white' : 'text-gray-500'
            }`}>people said YIMBY</span>
          </div>
        </Button>
        <Button
          variant={feedback === 'nimby' ? "outline" : "outline"}
          onClick={() => onFeedback('nimby')}
          className={`flex-1 flex items-center gap-3 justify-start h-auto p-3 ${
            feedback === 'nimby' ? 'bg-[#ea384c]/10' : ''
          }`}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src="/lovable-uploads/4dfbdd6f-07d8-4c20-bd77-0754d1f78644.png"
              alt="NIMBY"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium">{feedbackStats.nimbyCount}</span>
            <span className="text-sm text-gray-500">people said NIMBY</span>
          </div>
        </Button>
      </div>
    </Card>
  );
};