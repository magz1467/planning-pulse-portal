import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ServiceImpact {
  impact: 'positive' | 'negative' | 'neutral';
  details: string;
}

interface ServicesImpactProps {
  services: Record<string, ServiceImpact>;
}

export const ServicesImpact = ({ services }: ServicesImpactProps) => {
  if (!services || Object.keys(services).length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Impact on Local Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(services).map(([service, { impact, details }]) => (
          <div 
            key={service} 
            className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
              impact === 'positive' ? 'bg-primary/5 text-primary-dark' : 
              impact === 'negative' ? 'bg-destructive/5 text-destructive' : 
              'bg-muted/5 text-muted-foreground'
            }`}
            title={details}
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">{service}</p>
              <p className="text-sm opacity-90">
                {details}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <AlertCircle className="w-4 h-4" />
          <span>Supports services</span>
        </div>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Increases pressure</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Neutral impact</span>
        </div>
      </div>
    </Card>
  );
};