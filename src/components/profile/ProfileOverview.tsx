import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Bell } from 'lucide-react';
import { EmailDialog } from '@/components/EmailDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProfileOverviewProps {
  user: User | null;
  userProfile: any;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
  onEmailSubmit: (email: string, radius: string) => Promise<void>;
}

export const ProfileOverview = ({ 
  user, 
  userProfile, 
  onPostcodeUpdate,
  onEmailSubmit 
}: ProfileOverviewProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [postcode, setPostcode] = useState(userProfile?.Post_Code || '');
  const { toast } = useToast();

  const handlePostcodeSubmit = async () => {
    if (postcode.trim()) {
      try {
        await onPostcodeUpdate(postcode.trim());
        toast({
          title: "Success",
          description: "Your postcode has been updated",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update postcode",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p>{user?.email}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-500">Post Code</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="max-w-[200px]"
            />
            <Button 
              variant="outline" 
              size="default"
              onClick={handlePostcodeSubmit}
            >
              {userProfile?.Post_Code ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Notification Settings</label>
          <div className="mt-2">
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowEmailDialog(true)}
            >
              <Bell className="h-4 w-4" />
              {userProfile?.Radius_from_pc ? 'Update Alert Settings' : 'Set Up Alerts'}
            </Button>
            {userProfile?.Radius_from_pc && (
              <p className="text-sm text-gray-500 mt-2">
                Currently receiving alerts within {userProfile.Radius_from_pc}m of your postcode
              </p>
            )}
          </div>
        </div>
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={onEmailSubmit}
        applicationRef={userProfile?.Post_Code}
      />
    </Card>
  );
};