interface ImpactFactorsProps {
  factors: Record<string, number>;
  title: string;
  getScoreExplanation: (category: string, value: number) => string;
}

export const ImpactFactors = ({ 
  factors, 
  title,
  getScoreExplanation 
}: ImpactFactorsProps) => {
  return (
    <div>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="grid gap-4">
        {Object.entries(factors).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <span className="font-medium">{value}/5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {getScoreExplanation(key, value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};