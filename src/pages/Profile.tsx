import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { SavedDevelopmentsTab } from '@/components/profile/SavedDevelopmentsTab';
import { PetitionsTab } from '@/components/profile/PetitionsTab';
import { SettingsTab } from '@/components/profile/SettingsTab';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [petitions, setPetitions] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchUserData();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Modified query to handle multiple results
      const { data: profileData, error: profileError } = await supabase
        .from('User_data')
        .select('*')
        .eq('Email', session.user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (profileError) throw profileError;
      
      // Use the most recent profile if exists
      setUserProfile(profileData?.[0] || null);

      const { data: petitionsData, error: petitionsError } = await supabase
        .from('petitions')
        .select(`
          *,
          developments (
            title,
            address,
            status
          )
        `)
        .eq('user_id', session.user.id);

      if (petitionsError) throw petitionsError;
      setPetitions(petitionsData);

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (email: string, radius: string) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({
          'Post Code': userProfile?.Post_Code,
          'Radius_from_pc': parseInt(radius),
        })
        .eq('Email', email);

      if (error) throw error;

      setUserProfile(prev => ({
        ...prev,
        Radius_from_pc: parseInt(radius)
      }));

      toast({
        title: "Success",
        description: "Your notification preferences have been updated",
      });

      fetchUserData();
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  const handleMarketingUpdate = async (value: boolean) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({ Marketing: value })
        .eq('Email', user?.email);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, Marketing: value }));
      toast({
        title: "Success",
        description: "Marketing preferences updated",
      });
    } catch (error) {
      console.error('Error updating marketing preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update marketing preferences",
        variant: "destructive",
      });
    }
  };

  const handlePostcodeUpdate = async (postcode: string) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({ 'Post Code': postcode })
        .eq('Email', user?.email);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, 'Post Code': postcode }));
      toast({
        title: "Success",
        description: "Postcode updated successfully",
      });
    } catch (error) {
      console.error('Error updating postcode:', error);
      toast({
        title: "Error",
        description: "Failed to update postcode",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
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
              onPostcodeUpdate={handlePostcodeUpdate}
              onEmailSubmit={handleEmailSubmit}
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
              onMarketingUpdate={handleMarketingUpdate}
              onSignOut={handleSignOut}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;