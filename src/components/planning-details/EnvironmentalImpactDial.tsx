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
    if (score < 30) {
      return '#F2FCE2'; // Green for low impact
    } else if (score >= 70) {
      return '#ea384c'; // Red for high impact
    } else {
      // For scores between 30-70, calculate the orange intensity
      const orangeIntensity = (score - 30) / 40; // 40 is the range (70-30)
      
      // Start color (lighter orange)
      const start = {
        r: parseInt("FE", 16), // From #FEC6A1
        g: parseInt("C6", 16),
        b: parseInt("A1", 16)
      };
      
      // End color (darker orange)
      const end = {
        r: parseInt("F9", 16), // From #F97316
        g: parseInt("73", 16),
        b: parseInt("16", 16)
      };
      
      // Interpolate between light and dark orange
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

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Environmental Impact</h3>
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