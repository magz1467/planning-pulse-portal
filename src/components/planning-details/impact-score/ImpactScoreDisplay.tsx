import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { BarChart2, TrendingDown, TrendingUp } from "lucide-react";

interface ImpactScoreDisplayProps {
  score: number;
  progress: number;
}

const getScoreColor = (score: number) => {
  if (score < 30) return "text-primary bg-primary/10";
  if (score >= 70) return "text-destructive bg-destructive/10";
  return "text-orange-600 bg-orange-100";
};

const getScoreText = (score: number) => {
  if (score < 30) return "Low Impact";
  if (score >= 70) return "High Impact";
  return "Medium Impact";
};

const getScoreIcon = (score: number) => {
  if (score < 30) return <TrendingDown className="h-5 w-5" />;
  if (score >= 70) return <TrendingUp className="h-5 w-5" />;
  return <BarChart2 className="h-5 w-5" />;
};

export const ImpactScoreDisplay = ({ score, progress }: ImpactScoreDisplayProps) => {
  const colorClass = getScoreColor(score);
  const scoreText = getScoreText(score);
  const icon = getScoreIcon(score);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${colorClass}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-xl">{score}/100</h3>
            <p className="text-sm text-muted-foreground">{scoreText}</p>
          </div>
        </div>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        indicatorClassName={score < 30 ? "bg-primary" : score >= 70 ? "bg-destructive" : "bg-orange-500"}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low Impact</span>
        <span>High Impact</span>
      </div>
    </div>
  );
};