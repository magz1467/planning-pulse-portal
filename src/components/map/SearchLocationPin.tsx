import { MapPin } from "lucide-react";

interface SearchLocationPinProps {
  position: [number, number];
}

export const SearchLocationPin = ({ position }: SearchLocationPinProps) => {
  return (
    <div 
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
      style={{ 
        left: '50%',
        top: '50%'
      }}
    >
      <MapPin className="w-8 h-8 text-primary" />
    </div>
  );
};