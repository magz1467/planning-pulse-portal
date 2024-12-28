import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

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

      // Get most recent user profile
      const { data: profileData, error: profileError } = await supabase
        .from('User_data')
        .select('*')
        .eq('Email', session.user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (profileError) throw profileError;
      setUserProfile(profileData?.[0] || null);

      // Get petitions with development data
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
      setPetitions(petitionsData || []);

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

  const handleInterestTypeUpdate = async (type: string) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({ Type: type })
        .eq('Email', user?.email);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, Type: type }));
      toast({
        title: "Success",
        description: "Interest type updated successfully",
      });
    } catch (error) {
      console.error('Error updating interest type:', error);
      toast({
        title: "Error",
        description: "Failed to update interest type",
        variant: "destructive",
      });
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
        <ProfileHeader user={user} />
        <ProfileTabs 
          user={user}
          userProfile={userProfile}
          petitions={petitions}
          onPostcodeUpdate={handlePostcodeUpdate}
          onEmailSubmit={handleEmailSubmit}
          onMarketingUpdate={handleMarketingUpdate}
          onSignOut={handleSignOut}
          onInterestTypeUpdate={handleInterestTypeUpdate}
        />
      </main>
    </div>
  );
};

export default Profile;
