import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MapGeneration = () => {
  const { toast } = useToast();
  const [isGeneratingMaps, setIsGeneratingMaps] = useState(false);

  const handleGenerateMaps = async () => {
    try {
      setIsGeneratingMaps(true);
      console.log('Starting map generation process...');
      
      // Get 10 applications that don't have visualizations yet
      const { data: applications, error: fetchError } = await supabase
        .from('applications')
        .select('application_id, centroid')
        .is('image_link', null)
        .limit(10);

      if (fetchError) {
        throw new Error(`Failed to fetch applications: ${fetchError.message}`);
      }

      if (!applications?.length) {
        toast({
          title: "No applications to process",
          description: "All applications already have visualizations",
        });
        return;
      }

      toast({
        title: "Generating static maps",
        description: `Processing ${applications.length} applications`,
      });

      const { data, error } = await supabase.functions.invoke('generate-static-map', {
        body: { applications }
      });

      if (error) {
        console.error('Error response:', error);
        throw new Error(`Failed to generate maps: ${error.message}`);
      }

      console.log('Generation result:', data);
      
      toast({
        title: "Success!",
        description: `Generated visualizations for ${data.images.length} applications`,
      });

    } catch (error) {
      console.error('Error generating maps:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate static maps",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMaps(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateMaps}
        className="w-full md:w-auto"
        disabled={isGeneratingMaps}
      >
        {isGeneratingMaps ? "Generating Maps..." : "Generate Maps for 10 Applications"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Click to generate static map visualizations for up to 10 applications that don't have them yet.
      </p>
    </div>
  );
};