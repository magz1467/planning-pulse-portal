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
        return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700";
      case "negative":
        return "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getServiceImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "↑";
      case "negative":
        return "↓";
      default:
        return "→";
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
              className={`rounded-lg p-4 ${getServiceImpactColor(data.impact)}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{service}</span>
                <span className="text-lg font-bold">
                  {getServiceImpactIcon(data.impact)}
                </span>
              </div>
              <p className="text-sm mt-1">{data.details}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};