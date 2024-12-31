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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProfileHeader />
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
            {activeTab === "overview" && <ProfileOverview />}
            {activeTab === "saved" && <SavedApplicationsTab />}
            {activeTab === "petitions" && <PetitionsTab />}
            {activeTab === "activity" && <ActivityTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Profile;