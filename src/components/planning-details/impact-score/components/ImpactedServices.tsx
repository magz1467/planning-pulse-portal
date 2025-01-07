import { Separator } from "@/components/ui/separator";

interface ImpactedServicesProps {
  services: Record<
    string,
    {
      impact: "positive" | "negative" | "neutral";
      details: string;
    }
  >;
}

export const ImpactedServices = ({ services }: ImpactedServicesProps) => {
  const getServiceImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-emerald-600 dark:text-emerald-400";
      case "negative":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-muted-foreground";
    }
  };

  if (!services || Object.keys(services).length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="font-medium mb-3">Impact on Local Services</h4>
        <div className="grid gap-3">
          {Object.entries(services).map(([service, data]) => (
            <div key={service} className="text-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{service}</span>
                <span className={getServiceImpactColor(data.impact)}>
                  {data.impact.charAt(0).toUpperCase() + data.impact.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">{data.details}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};