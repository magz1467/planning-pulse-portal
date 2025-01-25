import { MapPin } from "lucide-react";

interface SearchLocationPinProps {
  position: [number, number];
}

export const SearchLocationPin = ({ position }: SearchLocationPinProps) => {
  return (
    <div className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
      <MapPin className="w-8 h-8 text-sky-500" />
    </div>
  );
};