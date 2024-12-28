import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface SettingsTabProps {
  userProfile: any;
  onMarketingUpdate: (value: boolean) => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const SettingsTab = ({ userProfile, onMarketingUpdate, onSignOut }: SettingsTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Marketing Preferences</h3>
          <div className="flex items-center gap-4">
            <Button
              variant={userProfile?.Marketing ? "default" : "outline"}
              onClick={() => onMarketingUpdate(true)}
            >
              Opt In
            </Button>
            <Button
              variant={!userProfile?.Marketing ? "default" : "outline"}
              onClick={() => onMarketingUpdate(false)}
            >
              Opt Out
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Account Actions</h3>
          <Button
            variant="destructive"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  );
};