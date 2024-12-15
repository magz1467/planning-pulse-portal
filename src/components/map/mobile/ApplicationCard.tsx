import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "@/components/ui/image";

interface ApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplicationCard = ({ application, isSelected, onClick }: ApplicationCardProps) => {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={onClick}
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          src={application.image}
          alt={application.title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-semibold text-primary truncate">
          {application.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1 truncate">
          {application.address}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
            {application.status}
          </span>
          <span className="text-xs text-gray-500">{application.distance}</span>
        </div>
      </div>
    </Card>
  );
};