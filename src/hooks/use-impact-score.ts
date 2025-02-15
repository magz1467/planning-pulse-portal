import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImpactScoreData } from "@/components/planning-details/impact-score/types";

export const useImpactScore = (initialScore: number | null, initialDetails: ImpactScoreData | undefined, applicationId: number) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [score, setScore] = useState<number | null>(initialScore);
  const [details, setDetails] = useState<ImpactScoreData | undefined>(initialDetails);
  const { toast } = useToast();

  console.log('useImpactScore - Initial state:', {
    initialScore,
    initialDetails,
    applicationId
  });

  useEffect(() => {
    // Reset state when applicationId changes
    console.log('useImpactScore - Resetting state for applicationId:', applicationId);
    setScore(initialScore);
    setDetails(initialDetails);
    setProgress(0);
    setHasTriggered(false);
  }, [applicationId, initialScore, initialDetails]);

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => setProgress(score), 100);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const generateScore = async () => {
    setIsLoading(true);
    setHasTriggered(true);

    try {
      console.log('useImpactScore - Calling generate-single-impact-score with applicationId:', applicationId);
      
      const { data, error } = await supabase.functions.invoke('generate-single-impact-score', {
        body: { applicationId }
      });

      console.log('useImpactScore - Response from generate-single-impact-score:', { data, error });

      if (error) {
        console.error('useImpactScore - Supabase function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No response from server');
      }

      if (data.success) {
        toast({
          title: "Impact score generated",
          description: "The application's impact score has been calculated and saved.",
        });
        
        console.log('useImpactScore - Setting new score and details:', {
          score: data.score,
          details: data.details,
          impacted_services: data.impacted_services
        });

        setScore(data.score);
        setDetails({
          ...data.details,
          impacted_services: data.impacted_services
        });

        // Save the score to the database
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            impact_score: data.score,
            impact_score_details: data.details,
            impacted_services: data.impacted_services
          })
          .eq('application_id', applicationId);

        if (updateError) {
          console.error('useImpactScore - Error saving impact score:', updateError);
          throw updateError;
        }
      } else {
        console.error('useImpactScore - Failed to generate impact score:', data.error);
        throw new Error(data.error || 'Failed to generate impact score');
      }
    } catch (error) {
      console.error('useImpactScore - Error generating impact score:', error);
      toast({
        title: "Error",
        description: "Failed to generate impact score. Please try again later.",
        variant: "destructive",
      });
      setHasTriggered(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    progress,
    isLoading,
    hasTriggered,
    score,
    details,
    generateScore
  };
};