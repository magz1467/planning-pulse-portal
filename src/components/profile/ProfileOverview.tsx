import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { EmailDialog } from '@/components/EmailDialog';
import { useState } from 'react';
import { PostcodeSection } from './PostcodeSection';
import { NotificationSettings } from './NotificationSettings';

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
      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p>{user?.email}</p>
        </div>
        
        <PostcodeSection 
          initialPostcode={userProfile?.Post_Code}
          onPostcodeUpdate={onPostcodeUpdate}
        />

        <NotificationSettings 
          radiusFromPc={userProfile?.Radius_from_pc}
          onOpenEmailDialog={() => setShowEmailDialog(true)}
        />
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