import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedDevelopments } from "@/components/SavedDevelopments";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Bell } from 'lucide-react';
import { EmailDialog } from '@/components/EmailDialog';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [petitions, setPetitions] = useState<any[]>([]);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
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

      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('User_data')
        .select('*')
        .eq('Email', session.user.email)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profileData);

      // Fetch user petitions
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

      setShowEmailDialog(false);
      setUserProfile(prev => ({
        ...prev,
        Radius_from_pc: parseInt(radius)
      }));

      toast({
        title: "Success",
        description: "Your notification preferences have been updated",
      });

      // Refresh user data
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
      setShowEmailDialog(true);
    } catch (error) {
      console.error('Error updating postcode:', error);
      toast({
        title: "Error",
        description: "Failed to update postcode",
        variant: "destructive",
      });
    }
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
                          handlePostcodeUpdate(postcode);
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
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Developments</h2>
              <SavedDevelopments 
                applications={[]} 
                onSelectApplication={(id) => navigate(`/map?development=${id}`)} 
              />
            </Card>
          </TabsContent>

          <TabsContent value="petitions">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Petitions</h2>
              {petitions.length > 0 ? (
                <div className="space-y-4">
                  {petitions.map((petition) => (
                    <Card key={petition.id} className="p-4">
                      <h3 className="font-semibold">{petition.developments.title}</h3>
                      <p className="text-sm text-gray-500">{petition.developments.address}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          {petition.developments.status}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Reasons:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {petition.reasons.map((reason: string, index: number) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">You haven't created any petitions yet.</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Marketing Preferences</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={userProfile?.Marketing ? "default" : "outline"}
                      onClick={() => handleMarketingUpdate(true)}
                    >
                      Opt In
                    </Button>
                    <Button
                      variant={!userProfile?.Marketing ? "default" : "outline"}
                      onClick={() => handleMarketingUpdate(false)}
                    >
                      Opt Out
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/');
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        applicationRef={userProfile?.Post_Code}
      />
    </div>
  );
};

export default Profile;
