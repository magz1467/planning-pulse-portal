import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Mission from "@/components/Mission";
import { Stats } from "@/components/Stats";
import StayUpToDate from "@/components/StayUpToDate";
import GetInTouch from "@/components/GetInTouch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const fetchTrialData = async () => {
    try {
      toast({
        title: "Fetching data...",
        description: "Getting the latest planning applications from Landhawk",
      });

      const { data, error } = await supabase.functions.invoke('fetch-trial-data');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Planning application data has been updated",
      });

      console.log('Fetch trial data response:', data);
    } catch (error) {
      console.error('Error fetching trial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch planning data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Services />
        <Mission />
        <Stats />
        <StayUpToDate />
        <GetInTouch />
        
        {/* Admin section */}
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
            <Button 
              onClick={fetchTrialData}
              className="bg-primary hover:bg-primary-dark"
            >
              Fetch Landhawk Data
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;