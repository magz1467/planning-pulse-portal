import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileOverview } from './ProfileOverview';
import { SavedApplicationsTab } from './SavedApplicationsTab';
import { PetitionsTab } from './PetitionsTab';
import { SettingsTab } from './SettingsTab';
import { ActivityTab } from './ActivityTab';
import { useNavigate } from 'react-router-dom';

interface ProfileTabsProps {
  user: User | null;
  userProfile: any;
  petitions: any[];
  onPostcodeUpdate: (postcode: string) => Promise<void>;
  onEmailSubmit: (email: string, radius: string) => Promise<void>;
  onMarketingUpdate: (value: boolean) => Promise<void>;
  onSignOut: () => Promise<void>;
  onInterestTypeUpdate: (type: string) => Promise<void>;
}

export const ProfileTabs = ({ 
  user, 
  userProfile, 
  petitions,
  onPostcodeUpdate,
  onEmailSubmit,
  onMarketingUpdate,
  onSignOut,
  onInterestTypeUpdate
}: ProfileTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="saved">Saved Applications</TabsTrigger>
        <TabsTrigger value="petitions">My Petitions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProfileOverview 
          user={user}
          userProfile={userProfile}
          onPostcodeUpdate={onPostcodeUpdate}
          onInterestTypeUpdate={onInterestTypeUpdate}
        />
      </TabsContent>

      <TabsContent value="activity">
        <ActivityTab userId={user?.id || ''} />
      </TabsContent>

      <TabsContent value="saved">
        <SavedApplicationsTab 
          onSelectApplication={(id) => navigate(`/map?application=${id}`)}
        />
      </TabsContent>

      <TabsContent value="petitions">
        <PetitionsTab petitions={petitions} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab 
          userProfile={userProfile}
          onMarketingUpdate={onMarketingUpdate}
          onSignOut={onSignOut}
        />
      </TabsContent>
    </Tabs>
  );
};