import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface EnvironmentalImpactDialProps {
  score: number;
}

export const EnvironmentalImpactDial = ({ score }: EnvironmentalImpactDialProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (score: number) => {
    // Convert score to a percentage for gradient calculation
    const percent = score / 100;
    
    // RGB values for start and end colors
    const start = {
      r: parseInt("F2", 16), // From #F2FCE2
      g: parseInt("FC", 16),
      b: parseInt("E2", 16)
    };
    
    const end = {
      r: parseInt("ea", 16), // From #ea384c
      g: parseInt("38", 16),
      b: parseInt("4c", 16)
    };
    
    // Interpolate between colors
    const r = Math.round(start.r + (end.r - start.r) * percent);
    const g = Math.round(start.g + (end.g - start.g) * percent);
    const b = Math.round(start.b + (end.b - start.b) * percent);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Environmental Impact</h3>
          <span 
            className="text-sm font-medium"
            style={{ color: getColor(score) }}
          >
            {score}/100
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