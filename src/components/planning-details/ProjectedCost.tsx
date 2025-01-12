import { Card } from "@/components/ui/card";

interface ProjectedCostProps {
  cost: string | number | null | undefined;
}

export const ProjectedCost = ({ cost }: ProjectedCostProps) => {
  if (!cost) return null;

  // Convert to number and format with £ sign
  const formattedCost = Number(cost).toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Projected Cost of Works</h3>
      <p className="text-lg">{formattedCost}</p>
    </Card>
  );
};