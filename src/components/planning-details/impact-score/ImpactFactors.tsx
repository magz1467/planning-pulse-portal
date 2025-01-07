import { Leaf, Users } from "lucide-react";

interface ImpactFactorsProps {
  environmental?: Record<string, number>;
  social?: Record<string, number>;
}

export const ImpactFactors = ({ environmental, social }: ImpactFactorsProps) => {
  if (!environmental && !social) return null;
  
  return (
    <div className="space-y-4 mt-6 pt-6 border-t">
      {environmental && (
        <div className="flex items-start gap-3">
          <Leaf className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium">Environmental Impact</h4>
            <p className="text-sm text-muted-foreground">
              Environmental factors including noise, air quality and biodiversity
            </p>
          </div>
        </div>
      )}

      {social && (
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium">Social Impact</h4>
            <p className="text-sm text-muted-foreground">
              Community impact and local economy factors
            </p>
          </div>
        </div>
      )}
    </div>
  );
};