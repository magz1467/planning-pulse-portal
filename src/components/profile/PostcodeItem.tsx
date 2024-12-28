import { Bell, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PostcodeItemProps {
  id: number;
  postcode: string;
  radius?: string;
  onDelete: (id: number) => void;
  onAlertClick: (postcode: string) => void;
}

export const PostcodeItem = ({ 
  id, 
  postcode, 
  radius, 
  onDelete, 
  onAlertClick 
}: PostcodeItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 p-2 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <span>{postcode}</span>
          {radius && (
            <span className="text-sm text-gray-500">
              Alerts: {radius === "1000" ? "1km" : `${radius}m`}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAlertClick(postcode)}
        className="h-9 w-9"
      >
        <Bell className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        className="h-9 w-9"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};