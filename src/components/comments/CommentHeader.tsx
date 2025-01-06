import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface CommentHeaderProps {
  displayName: string;
  createdAt: string;
  canDelete: boolean;
  onDelete?: () => void;
}

export const CommentHeader = ({
  displayName,
  createdAt,
  canDelete,
  onDelete
}: CommentHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="text-sm text-gray-600">
        {displayName} • {new Date(createdAt).toLocaleDateString()}
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
