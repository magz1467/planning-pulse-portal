import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface FeedbackButtonsProps {
  applicationId: number;
  feedbackStats?: {
    yimby?: number;
    nimby?: number;
  };
  onFeedback: (applicationId: number, type: 'yimby' | 'nimby') => void;
}

export const FeedbackButtons = ({ applicationId, feedbackStats, onFeedback }: FeedbackButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 flex items-center gap-1.5 hover:bg-green-50"
        onClick={(e) => {
          e.stopPropagation();
          onFeedback(applicationId, 'yimby');
        }}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src="/lovable-uploads/3df4c01a-a60f-43c5-892a-18bf170175b6.png"
            alt="YIMBY"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-gray-600 text-xs">{feedbackStats?.yimby || 0}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 flex items-center gap-1.5 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          onFeedback(applicationId, 'nimby');
        }}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src="/lovable-uploads/4dfbdd6f-07d8-4c20-bd77-0754d1f78644.png"
            alt="NIMBY"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-gray-600 text-xs">{feedbackStats?.nimby || 0}</span>
      </Button>
    </div>
  );
};