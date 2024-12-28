import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { PostcodeSection } from './PostcodeSection';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { format } from 'date-fns';

interface ProfileOverviewProps {
  user: User | null;
  userProfile: any;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
  onInterestTypeUpdate?: (type: string) => Promise<void>;
}

export const ProfileOverview = ({ 
  user, 
  userProfile, 
  onPostcodeUpdate,
  onInterestTypeUpdate
}: ProfileOverviewProps) => {
  const [selectedType, setSelectedType] = useState(userProfile?.Type || '');

  const handleTypeChange = async (value: string) => {
    setSelectedType(value);
    if (onInterestTypeUpdate) {
      await onInterestTypeUpdate(value);
    }
  };

  const memberSince = userProfile?.created_at 
    ? format(new Date(userProfile.created_at), 'MMMM d, yyyy')
    : 'Unknown';

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-500">Member since</label>
          <p>{memberSince}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p>{user?.email}</p>
        </div>
        
        <PostcodeSection 
          initialPostcode={userProfile?.Post_Code}
          onPostcodeUpdate={onPostcodeUpdate}
        />

        <div className="space-y-3">
          <label className="text-sm text-gray-500">Interest Type</label>
          <RadioGroup 
            value={selectedType} 
            onValueChange={handleTypeChange}
            className="gap-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="resident" id="resident" />
              <div className="grid gap-1.5">
                <Label htmlFor="resident" className="font-medium">Resident</Label>
                <p className="text-sm text-gray-500">
                  Stay informed about planning changes in your local area and have your say
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="developer" id="developer" />
              <div className="grid gap-1.5">
                <Label htmlFor="developer" className="font-medium">Developer</Label>
                <p className="text-sm text-gray-500">
                  Submit and track planning applications, manage developments
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="council" id="council" />
              <div className="grid gap-1.5">
                <Label htmlFor="council" className="font-medium">Council Member</Label>
                <p className="text-sm text-gray-500">
                  Review and process planning applications, engage with the community
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
};