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
  const getScoreIcon = (score: number) => {
    switch (score) {
      case 1:
        return "●";
      case 2:
        return "●●";
      case 3:
        return "●●●";
      case 4:
        return "●●●●";
      case 5:
        return "●●●●●";
      default:
        return "○";
    }
  };

  const getScoreTextColor = (score: number) => {
    switch (score) {
      case 1:
        return "text-emerald-600";
      case 2:
        return "text-lime-600";
      case 3:
        return "text-yellow-600";
      case 4:
        return "text-orange-600";
      case 5:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="grid gap-4">
        {Object.entries(factors).map(([key, value]) => (
          <div 
            key={key} 
            className="rounded-lg border p-4 bg-white transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700 capitalize font-medium">
                {key.replace(/_/g, " ")}
              </span>
              <div className="flex items-center gap-1">
                <span className={`text-xs tracking-wider ${getScoreTextColor(value)}`}>
                  {getScoreIcon(value)}
                </span>
                <span className={`font-bold ml-2 ${getScoreTextColor(value)}`}>
                  {value}/5
                </span>
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-600">
              {getScoreExplanation(key, value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};