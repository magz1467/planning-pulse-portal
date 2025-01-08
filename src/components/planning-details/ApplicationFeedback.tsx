import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ApplicationFeedbackProps {
  application: Application;
}

export const ApplicationFeedback = ({ application }: ApplicationFeedbackProps) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [feedbackStats, setFeedbackStats] = useState({ thumbsUp: 0, thumbsDown: 0 });
  const { toast } = useToast();

  // Fetch initial feedback state and stats
  useEffect(() => {
    const fetchFeedbackState = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's current feedback
        const { data: existingFeedback } = await supabase
          .from('application_feedback')
          .select('feedback_type')
          .eq('application_id', application.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingFeedback) {
          setFeedback(existingFeedback.feedback_type as 'up' | 'down');
        }

        // Get feedback stats
        const { data: stats } = await supabase
          .rpc('get_application_feedback_stats', {
            app_id: application.id
          });

        if (stats) {
          const thumbsUp = stats.find(s => s.feedback_type === 'up')?.count || 0;
          const thumbsDown = stats.find(s => s.feedback_type === 'down')?.count || 0;
          setFeedbackStats({ thumbsUp, thumbsDown });
        }
      } catch (error) {
        console.error('Error fetching feedback state:', error);
      }
    };

    fetchFeedbackState();
  }, [application.id]);

  const handleFeedback = async (type: 'up' | 'down') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to provide feedback",
          variant: "destructive"
        });
        return;
      }

      // First check if feedback exists
      const { data: existingFeedback } = await supabase
        .from('application_feedback')
        .select('id')
        .eq('application_id', application.id)
        .eq('user_id', user.id)
        .maybeSingle();

      let error;
      
      if (existingFeedback) {
        // Update existing feedback
        const { error: updateError } = await supabase
          .from('application_feedback')
          .update({ feedback_type: type })
          .eq('id', existingFeedback.id);
        error = updateError;
      } else {
        // Insert new feedback
        const { error: insertError } = await supabase
          .from('application_feedback')
          .insert({
            application_id: application.id,
            user_id: user.id,
            feedback_type: type
          });
        error = insertError;
      }

      if (error) throw error;

      setFeedback(type);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback"
      });

      // Refresh feedback stats
      const { data: stats } = await supabase
        .rpc('get_application_feedback_stats', {
          app_id: application.id
        });

      if (stats) {
        const thumbsUp = stats.find(s => s.feedback_type === 'up')?.count || 0;
        const thumbsDown = stats.find(s => s.feedback_type === 'down')?.count || 0;
        setFeedbackStats({ thumbsUp, thumbsDown });
      }

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <h3 className="font-semibold mb-4">Community Feedback</h3>
      <div className="flex flex-col gap-2">
        <Button
          variant={feedback === 'up' ? "default" : "outline"}
          onClick={() => handleFeedback('up')}
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
          onClick={() => handleFeedback('down')}
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