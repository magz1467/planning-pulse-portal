import { MapPin } from "lucide-react";

interface LocationInfoProps {
  address: string;
}

export const LocationInfo = ({ address }: LocationInfoProps) => {
  return (
    <div className="flex items-center gap-1 mt-1 text-gray-600">
      <MapPin className="w-3 h-3" />
      <p className="text-sm truncate">{address}</p>
    </div>
  );
};