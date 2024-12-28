import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileOverview } from './ProfileOverview';
import { SavedDevelopmentsTab } from './SavedDevelopmentsTab';
import { PetitionsTab } from './PetitionsTab';
import { SettingsTab } from './SettingsTab';
import { useNavigate } from 'react-router-dom';

interface ProfileTabsProps {
  user: User | null;
  userProfile: any;
  petitions: any[];
  onPostcodeUpdate: (postcode: string) => Promise<void>;
  onEmailSubmit: (email: string, radius: string) => Promise<void>;
  onMarketingUpdate: (value: boolean) => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const ProfileTabs = ({ 
  user, 
  userProfile, 
  petitions,
  onPostcodeUpdate,
  onEmailSubmit,
  onMarketingUpdate,
  onSignOut
}: ProfileTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="saved">Saved Developments</TabsTrigger>
        <TabsTrigger value="petitions">My Petitions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProfileOverview 
          user={user}
          userProfile={userProfile}
          onPostcodeUpdate={onPostcodeUpdate}
          onEmailSubmit={onEmailSubmit}
        />
      </TabsContent>

      <TabsContent value="saved">
        <SavedDevelopmentsTab 
          onSelectApplication={(id) => navigate(`/map?development=${id}`)}
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