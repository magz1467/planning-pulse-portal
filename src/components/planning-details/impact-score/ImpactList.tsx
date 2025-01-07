import { Card } from "@/components/ui/card";

interface ImpactListProps {
  title: string;
  items?: string[];
}

export const ImpactList = ({ title, items }: ImpactListProps) => {
  if (!items?.length) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-4 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm">{item}</li>
        ))}
      </ul>
    </Card>
  );
};