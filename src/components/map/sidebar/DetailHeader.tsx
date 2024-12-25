import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailHeaderProps {
  onClose: () => void;
}

export const DetailHeader = ({ onClose }: DetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b py-2 px-4 flex-shrink-0">
      <h2 className="font-semibold">Planning Application Details</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="ml-2"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};