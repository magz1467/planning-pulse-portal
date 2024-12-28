import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  radiusFromPc?: string | number;
  onOpenEmailDialog: () => void;
}

export const NotificationSettings = ({ radiusFromPc, onOpenEmailDialog }: NotificationSettingsProps) => {
  return (
    <div>
      <label className="text-sm text-gray-500">Notification Settings</label>
      <div className="mt-2">
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onOpenEmailDialog}
        >
          <Bell className="h-4 w-4" />
          {radiusFromPc ? 'Update Alert Settings' : 'Set Up Alerts'}
        </Button>
        {radiusFromPc && (
          <p className="text-sm text-gray-500 mt-2">
            Currently receiving alerts within {radiusFromPc}m of your postcode
          </p>
        )}
      </div>
    </div>
  );
};