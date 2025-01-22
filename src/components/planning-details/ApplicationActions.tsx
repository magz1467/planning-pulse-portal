import { Button } from "@/components/ui/button";
import { Heart, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicationSharing } from "./ApplicationSharing";
import { useToast } from "@/hooks/use-toast";

interface ApplicationActionsProps {
  applicationId: number;
  reference: string;
  isSaved: boolean;
  onSave: () => void;
  onShowEmailDialog: () => void;
}

export const ApplicationActions = ({
  applicationId,
  reference,
  isSaved,
  onSave,
  onShowEmailDialog,
}: ApplicationActionsProps) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        className={`flex items-center gap-2 ${isSaved ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}`}
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
      </Button>
      <ApplicationSharing 
        applicationId={applicationId} 
        reference={reference}
      />
    </div>
  );
};