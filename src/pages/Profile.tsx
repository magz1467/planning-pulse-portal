import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { SavedApplicationsTab } from "@/components/profile/SavedApplicationsTab";
import { PetitionsTab } from "@/components/profile/PetitionsTab";
import { ActivityTab } from "@/components/profile/ActivityTab";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    checkAdminStatus();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: profile } = await supabase
        .from('User_data')
        .select('*')
        .eq('Email', session.user.email)
        .single();
      setUserProfile(profile);
    } else {
      navigate('/');
    }
  };

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleGenerateTitles = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-titles-manual');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostcodeUpdate = async (postcode: string) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({ Post_Code: postcode })
        .eq('Email', user.email);

      if (error) throw error;

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

  const handleMarketingUpdate = async (value: boolean) => {
    try {
      const { error } = await supabase
        .from('User_data')
        .update({ Marketing: value })
        .eq('Email', user.email);

      if (error) throw error;

      setUserProfile({ ...userProfile, Marketing: value });
      toast({
        title: "Success",
        description: "Marketing preferences updated successfully",
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProfileHeader user={user} />
        <div className="mt-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {isAdmin && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
              <Button 
                onClick={handleGenerateTitles}
                disabled={isProcessing}
                className="bg-primary text-white"
              >
                {isProcessing ? "Processing..." : "Generate AI Titles"}
              </Button>
            </div>
          )}

          <div className="mt-6">
            {activeTab === "overview" && (
              <ProfileOverview 
                user={user}
                userProfile={userProfile}
                onPostcodeUpdate={handlePostcodeUpdate}
              />
            )}
            {activeTab === "saved" && <SavedApplicationsTab onSelectApplication={() => {}} />}
            {activeTab === "petitions" && <PetitionsTab petitions={[]} />}
            {activeTab === "activity" && <ActivityTab userId={user?.id} />}
            {activeTab === "settings" && (
              <SettingsTab 
                userProfile={userProfile}
                onMarketingUpdate={handleMarketingUpdate}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Profile;