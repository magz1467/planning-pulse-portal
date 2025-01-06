import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EnvironmentalImpactDialProps {
  score?: number | null;
  details?: Record<string, any>;
  applicationId: number;
}

export const EnvironmentalImpactDial = ({ score, details, applicationId }: EnvironmentalImpactDialProps) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score || 0), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const handleGenerateScore = async () => {
    setIsLoading(true);
    setHasTriggered(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-single-impact-score', {
        body: { applicationId }
      });

      if (error) {
        console.error('Supabase function error:', error);
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
        
        // Reload the page to show the new score
        window.location.reload();
      } else {
        console.error('Failed to generate impact score:', data.error);
        throw new Error(data.error || 'Failed to generate impact score');
      }
    } catch (error) {
      console.error('Error generating impact score:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate impact score. Please try again later.",
        variant: "destructive",
      });
      setHasTriggered(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getColor = (score: number) => {
    if (score < 30) {
      return '#22c55e';
    } else if (score >= 70) {
      return '#ea384c';
    } else {
      const orangeIntensity = (score - 30) / 40;
      const start = {
        r: parseInt("FE", 16),
        g: parseInt("C6", 16),
        b: parseInt("A1", 16)
      };
      const end = {
        r: parseInt("F9", 16),
        g: parseInt("73", 16),
        b: parseInt("16", 16)
      };
      const r = Math.round(start.r + (end.r - start.r) * orangeIntensity);
      const g = Math.round(start.g + (end.g - start.g) * orangeIntensity);
      const b = Math.round(start.b + (end.b - start.b) * orangeIntensity);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getImpactText = (score: number) => {
    if (score < 30) return "Low Impact";
    if (score >= 70) return "High Impact";
    return "Medium Impact";
  };

  if (!score) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Expected impact score</h3>
          <p className="text-sm text-gray-500">
            Impact score calculation is available for this application
          </p>
          <Button 
            onClick={handleGenerateScore}
            disabled={isLoading || hasTriggered}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "See impact score"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Expected impact score</h3>
        <p className="text-xs text-gray-500">
          Score calculated using weighted factors including size, location sensitivity, and development type
        </p>
        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-medium"
            style={{ color: getColor(score) }}
          >
            {score}/100
          </span>
          <span className="text-xs text-gray-500">
            ({getImpactText(score)})
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2"
          style={{
            background: '#F2FCE2',
            '--progress-background': getColor(score)
          } as React.CSSProperties}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>
    </Card>
  );
};