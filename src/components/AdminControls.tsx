import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminControls = () => {
  const { toast } = useToast();

  const handleGenerateTitles = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-application-titles');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4">Admin Controls</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Application Titles</h3>
          <p className="text-sm text-gray-600 mb-2">
            Generate AI titles for applications that don't have them yet. 
            Processes up to 50 applications per batch.
          </p>
          <Button 
            onClick={handleGenerateTitles}
            className="w-full"
          >
            Generate Application Titles
          </Button>
        </div>
      </div>
    </div>
  );
};