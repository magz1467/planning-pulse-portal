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
  const getServiceImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "✓";
      case "negative":
        return "!";
      default:
        return "•";
    }
  };

  const getServiceImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-emerald-600 border-emerald-200";
      case "negative":
        return "text-rose-600 border-rose-200";
      default:
        return "text-gray-600 border-gray-200";
    }
  };

  // Filter out neutral impacts
  const significantImpacts = Object.entries(services).filter(
    ([_, data]) => data.impact !== "neutral"
  );

  if (!services || significantImpacts.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="font-medium mb-3">Impact on Local Services</h4>
        <div className="grid gap-3">
          {significantImpacts.map(([service, data]) => (
            <div
              key={service}
              className={`rounded-lg border p-4 bg-white ${getServiceImpactColor(data.impact)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full border h-6 w-6 flex items-center justify-center text-sm font-bold ${getServiceImpactColor(data.impact)}`}>
                  {getServiceImpactIcon(data.impact)}
                </div>
                <div>
                  <span className="font-medium block">{service}</span>
                  <p className="text-sm mt-1 text-gray-600">{data.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};