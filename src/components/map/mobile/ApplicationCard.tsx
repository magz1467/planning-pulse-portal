import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";

interface ApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplicationCard = ({ application, isSelected, onClick }: ApplicationCardProps) => {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all p-4 ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-primary truncate">
        {application.title}
      </h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
          {application.status}
        </span>
        <span className="text-xs text-gray-500">{application.distance}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2 truncate">
        {application.address}
      </p>
    </Card>
  );
};