import { Card } from "@/components/ui/card";
import { Bell, ThumbsUp } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ActionButtonsProps {
  applicationId: number;
  isSaved: boolean;
  onSave: () => void;
  setShowEmailDialog: Dispatch<SetStateAction<boolean>>;
  setShowFeedbackDialog: Dispatch<SetStateAction<boolean>>;
}

export const ActionButtons = ({
  applicationId,
  isSaved,
  onSave,
  setShowEmailDialog,
  setShowFeedbackDialog,
}: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        className="p-4 cursor-pointer hover:bg-accent transition-colors"
        onClick={() => setShowEmailDialog(true)}
      >
        <div className="flex items-center gap-4">
          <Bell className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold">Get notified</h3>
            <p className="text-sm text-muted-foreground">
              When a decision is made
            </p>
          </div>
        </div>
      </Card>

      <Card
        className="p-4 cursor-pointer hover:bg-accent transition-colors"
        onClick={() => setShowFeedbackDialog(true)}
      >
        <div className="flex items-center gap-4">
          <ThumbsUp className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold">Give feedback</h3>
            <p className="text-sm text-muted-foreground">
              Share your thoughts
            </p>
          </div>
        </div>
      </Card>

      <Card
        className="p-4 cursor-pointer hover:bg-accent transition-colors"
        onClick={onSave}
      >
        <div className="flex items-center gap-4">
          <Bell className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold">
              {isSaved ? "Remove from saved" : "Save application"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isSaved
                ? "Remove this from your saved list"
                : "Add this to your saved list"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};