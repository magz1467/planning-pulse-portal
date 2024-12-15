import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";

interface ApplicationDescriptionProps {
  application: Application;
}

export const ApplicationDescription = ({ application }: ApplicationDescriptionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Description</h3>
      <p className="text-sm">{application.description}</p>
    </Card>
  );
};