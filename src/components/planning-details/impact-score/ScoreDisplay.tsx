import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  score: number;
  progress: number;
}

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

export const ScoreDisplay = ({ score, progress }: ScoreDisplayProps) => {
  const color = getColor(score);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span 
          className="text-sm font-medium"
          style={{ color }}
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
          '--progress-background': color
        } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low Impact</span>
        <span>High Impact</span>
      </div>
    </div>
  );
};