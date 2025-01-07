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
  const getScoreColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-gradient-to-r from-green-50 to-emerald-100";
      case 2:
        return "bg-gradient-to-r from-lime-50 to-lime-100";
      case 3:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100";
      case 4:
        return "bg-gradient-to-r from-orange-50 to-orange-100";
      case 5:
        return "bg-gradient-to-r from-red-50 to-red-100";
      default:
        return "bg-gray-50";
    }
  };

  const getScoreTextColor = (score: number) => {
    switch (score) {
      case 1:
        return "text-emerald-700";
      case 2:
        return "text-lime-700";
      case 3:
        return "text-yellow-700";
      case 4:
        return "text-orange-700";
      case 5:
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="grid gap-4">
        {Object.entries(factors).map(([key, value]) => (
          <div 
            key={key} 
            className={`rounded-lg p-4 ${getScoreColor(value)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700 capitalize font-medium">
                {key.replace(/_/g, " ")}
              </span>
              <span className={`font-bold ${getScoreTextColor(value)}`}>
                {value}/5
              </span>
            </div>
            <p className={`text-sm mt-2 ${getScoreTextColor(value)}`}>
              {getScoreExplanation(key, value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};