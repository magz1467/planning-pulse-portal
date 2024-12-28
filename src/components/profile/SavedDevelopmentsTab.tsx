import { Card } from "@/components/ui/card";
import { SavedDevelopments } from "@/components/SavedDevelopments";

interface SavedDevelopmentsTabProps {
  onSelectApplication: (id: string) => void;
}

export const SavedDevelopmentsTab = ({ onSelectApplication }: SavedDevelopmentsTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Saved Developments</h2>
      <SavedDevelopments 
        applications={[]} 
        onSelectApplication={onSelectApplication} 
      />
    </Card>
  );
};