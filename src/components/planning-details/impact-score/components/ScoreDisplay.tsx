import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  score: number;
  progress: number;
}

export const ScoreDisplay = ({ score, progress }: ScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-emerald-600 dark:text-emerald-400";
    if (score <= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getImpactText = (score: number) => {
    if (score <= 30) return "Low Impact";
    if (score <= 60) return "Moderate Impact";
    return "High Impact";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </span>
        <span className="text-sm text-muted-foreground">
          {getImpactText(score)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};