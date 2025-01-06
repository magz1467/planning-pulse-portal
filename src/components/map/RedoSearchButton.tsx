import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface RedoSearchButtonProps {
  onClick: () => void;
}

export const RedoSearchButton = ({ onClick }: RedoSearchButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-primary hover:bg-primary-dark shadow-lg pointer-events-auto"
    >
      <Search className="h-4 w-4 mr-2" />
      Redo Search Here
    </Button>
  );
};