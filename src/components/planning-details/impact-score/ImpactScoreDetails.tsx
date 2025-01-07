import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryScore {
  score: number;
  details: string;
}

interface ImpactScoreDetails {
  [category: string]: CategoryScore;
  key_concerns?: string[];
  recommendations?: string[];
}

interface ImpactScoreBreakdownProps {
  details: ImpactScoreDetails | null;
}

export const ImpactScoreDetails: React.FC<ImpactScoreBreakdownProps> = ({ details }) => {
  if (!details) return null;

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {Object.entries(details)
          .filter(([key]) => !['key_concerns', 'recommendations'].includes(key))
          .map(([category, scoreData]) => (
            <Card key={category} className="p-4">
              <h3 className="font-semibold capitalize mb-2">{category.replace(/_/g, ' ')}</h3>
              <p className="text-sm text-gray-600">Score: {scoreData.score}</p>
              <p className="text-sm mt-2">{scoreData.details}</p>
            </Card>
          ))}

        {details.key_concerns && details.key_concerns.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Key Concerns</h3>
            <ul className="list-disc pl-4 space-y-1">
              {details.key_concerns.map((concern, index) => (
                <li key={index} className="text-sm">{concern}</li>
              ))}
            </ul>
          </Card>
        )}

        {details.recommendations && details.recommendations.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc pl-4 space-y-1">
              {details.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm">{recommendation}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};