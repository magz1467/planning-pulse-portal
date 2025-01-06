import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface RedoSearchButtonProps {
  onClick: () => void;
}

export const RedoSearchButton = ({ onClick }: RedoSearchButtonProps) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <Button 
        onClick={onClick}
        className="bg-white text-black hover:bg-gray-100 shadow-lg"
      >
        <Search className="w-4 h-4 mr-2" />
        Search this area
      </Button>
    </div>
  );
};