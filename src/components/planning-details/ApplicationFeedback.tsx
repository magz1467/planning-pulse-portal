import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationFeedbackProps {
  feedback?: 'up' | 'down' | null;
  onFeedback: (type: 'up' | 'down') => void;
  applicationId: number;
}

export const ApplicationFeedback = ({ 
  feedback,
  onFeedback,
  applicationId
}: ApplicationFeedbackProps) => {
  const [feedbackStats, setFeedbackStats] = useState({
    thumbsUp: 0,
    thumbsDown: 0
  });

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      const { data: upVotes } = await supabase
        .from('application_feedback')
        .select('count')
        .eq('application_id', applicationId)
        .eq('feedback_type', 'up')
        .single();

      const { data: downVotes } = await supabase
        .from('application_feedback')
        .select('count')
        .eq('application_id', applicationId)
        .eq('feedback_type', 'down')
        .single();

      setFeedbackStats({
        thumbsUp: upVotes?.count || 0,
        thumbsDown: downVotes?.count || 0
      });
    };

    if (applicationId) {
      fetchFeedbackStats();
    }
  }, [applicationId]);

  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <h3 className="font-semibold mb-4">Community Feedback</h3>
      <div className="flex flex-col gap-2">
        <Button
          variant={feedback === 'up' ? "default" : "outline"}
          onClick={() => onFeedback('up')}
          className="flex items-center gap-2 justify-start"
        >
          <ThumbsUp className={`h-5 w-5 ${
            feedback === 'up' ? 'text-white' : 'text-primary'
          }`} />
          <span className="text-lg font-medium">{feedbackStats.thumbsUp}</span>
          <span className={`text-sm ${
            feedback === 'up' ? 'text-white' : 'text-gray-500'
          }`}>people like this</span>
        </Button>
        <Button
          variant={feedback === 'down' ? "outline" : "outline"}
          onClick={() => onFeedback('down')}
          className={`flex items-center gap-2 justify-start ${
            feedback === 'down' ? 'bg-[#ea384c]/10' : ''
          }`}
        >
          <ThumbsDown className={`h-5 w-5 ${
            feedback === 'down' ? 'text-[#ea384c]' : 'text-gray-600'
          }`} />
          <span className="text-lg font-medium">{feedbackStats.thumbsDown}</span>
          <span className="text-xs text-gray-500">people dislike this</span>
        </Button>
      </div>
    </Card>
  );
};