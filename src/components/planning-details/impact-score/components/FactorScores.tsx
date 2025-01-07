import { Check } from "lucide-react";

interface FactorScoresProps {
  factorScores: Record<string, number>;
}

export const FactorScores = ({ factorScores }: FactorScoresProps) => {
  return (
    <>
      {Object.entries(factorScores).map(([factor, score]) => (
        <div key={factor} className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="h-4 w-4 text-emerald-500" />
          <span>{factor} Impact Score: <span className="font-medium">{score.toFixed(1)}</span> out of 5</span>
        </div>
      ))}
    </>
  );
};