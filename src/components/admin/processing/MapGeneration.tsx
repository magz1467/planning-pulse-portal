import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MapGeneration = () => {
  const { toast } = useToast();
  const [isGeneratingMaps, setIsGeneratingMaps] = useState(false);
  const [isGeneratingD3, setIsGeneratingD3] = useState(false);

  const handleGenerateMaps = async () => {
    try {
      setIsGeneratingMaps(true);
      console.log('Starting map generation...');
      
      // Get 10 applications that don't have maps yet
      const { data: applications, error: fetchError } = await supabase
        .from('applications')
        .select('application_id, centroid')
        .is('image_map_url', null)
        .limit(10);

      if (fetchError) {
        throw new Error(`Failed to fetch applications: ${fetchError.message}`);
      }

      if (!applications?.length) {
        toast({
          title: "No applications to process",
          description: "All applications already have maps",
        });
        return;
      }

      toast({
        title: "Generating maps",
        description: `Processing ${applications.length} applications`,
      });

      const { data, error } = await supabase.functions.invoke('generate-static-maps-manual', {
        body: { applications }
      });

      if (error) {
        console.error('Error response:', error);
        throw new Error(`Failed to generate maps: ${error.message}`);
      }

      console.log('Generation result:', data);
      
      toast({
        title: "Success!",
        description: `Generated maps for ${applications.length} applications`,
      });

    } catch (error) {
      console.error('Error generating maps:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate maps",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMaps(false);
    }
  };

  const handleGenerateD3Examples = async () => {
    try {
      setIsGeneratingD3(true);
      console.log('Starting D3 examples generation...');
      
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
        title: "Generating D3 examples",
        description: `Processing ${applications.length} applications`,
      });

      const { data, error } = await supabase.functions.invoke('generate-d3-examples', {
        body: { applications }
      });

      if (error) {
        console.error('Error response:', error);
        throw new Error(`Failed to generate D3 examples: ${error.message}`);
      }

      console.log('Generation result:', data);
      
      toast({
        title: "Success!",
        description: `Generated visualizations for ${data.visualizations.length} applications`,
      });

    } catch (error) {
      console.error('Error generating D3 examples:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate D3 examples",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingD3(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleGenerateMaps}
          className="w-full md:w-auto"
          disabled={isGeneratingMaps}
        >
          {isGeneratingMaps ? "Generating Maps..." : "Generate Maps for 10 Applications"}
        </Button>
        <Button
          onClick={handleGenerateD3Examples}
          className="w-full md:w-auto"
          disabled={isGeneratingD3}
        >
          {isGeneratingD3 ? "Generating D3..." : "Generate D3 Examples for 10 Applications"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Click to generate static map visualizations for up to 10 applications that don't have them yet.
      </p>
    </div>
  );
};