import { Button } from "@/components/ui/button";
import { Bell, Heart, BookmarkIcon } from "lucide-react";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ActionButtonsProps {
  applicationId: number;
  isSaved: boolean;
  handleSave: () => void;
  setShowEmailDialog: (show: boolean) => void;
  setShowFeedbackDialog: (show: boolean) => void;
}

export const ActionButtons = ({
  applicationId,
  isSaved,
  handleSave,
  setShowEmailDialog,
  setShowFeedbackDialog
}: ActionButtonsProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Get Decision Updates</h3>
              <p className="text-sm text-gray-600">We'll notify you when this application is decided</p>
            </div>
          </div>
          <Button onClick={() => setShowEmailDialog(true)}>
            Get notified
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Is this your development?</h3>
            <p className="text-sm text-gray-600">Click here to verify and see full feedback</p>
          </div>
          <Button variant="outline" onClick={() => setShowFeedbackDialog(true)}>
            Get feedback
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Save for later</h3>
              <p className="text-sm text-gray-600">Keep track of this application</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`${isSaved ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Card>
    </div>
  );
};