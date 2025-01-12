import { Card } from "@/components/ui/card";

interface ProjectedCostProps {
  cost: string | number;
  visualizations?: string[];
}

export const ProjectedCost = ({ cost, visualizations }: ProjectedCostProps) => {
  // Convert to number and format with £ sign
  const formattedCost = Number(cost).toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Projected Cost of Works</h3>
      <p className="text-lg mb-4">{formattedCost}</p>
      
      {visualizations && visualizations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Visualizations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {visualizations.map((url, index) => (
              <div key={index} className="aspect-video">
                <img 
                  src={url} 
                  alt={`Visualization ${index + 1}`}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};