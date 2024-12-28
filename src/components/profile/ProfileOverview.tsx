import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bell } from 'lucide-react';
import { EmailDialog } from '@/components/EmailDialog';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p>{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Post Code</label>
          <div className="flex items-center gap-2">
            <p>{userProfile?.Post_Code || 'Not set'}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const postcode = prompt('Enter your postcode:');
                if (postcode) {
                  onPostcodeUpdate(postcode);
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {userProfile?.Post_Code ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500">Notification Radius</label>
          <div className="flex items-center gap-2">
            <p>{userProfile?.Radius_from_pc ? `${userProfile.Radius_from_pc}m` : 'Not set'}</p>
            {userProfile?.Post_Code && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEmailDialog(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {userProfile?.Radius_from_pc ? 'Update' : 'Set up'}
              </Button>
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