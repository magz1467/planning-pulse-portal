import { MapPin } from "lucide-react";

interface ApplicationCardLocationProps {
  address: string;
}

export const ApplicationCardLocation = ({ address }: ApplicationCardLocationProps) => {
  return (
    <div className="flex items-center gap-1 mt-1 text-gray-600">
      <MapPin className="w-3 h-3" />
      <p className="text-sm truncate">{address}</p>
    </div>
  );
};