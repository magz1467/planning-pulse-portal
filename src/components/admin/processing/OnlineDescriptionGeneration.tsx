import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const OnlineDescriptionGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescriptions = async () => {
    try {
      setIsGenerating(true);
      console.log('Starting online description generation...');
      
      toast({
        title: "Generating online descriptions",
        description: "This may take a few minutes for 10 applications",
      });

      const { data, error } = await supabase.functions.invoke('generate-online-description', {
        body: { batch_size: 10 }
      });

      if (error) {
        console.error('Error response:', error);
        throw new Error(`Failed to generate descriptions: ${error.message}`);
      }

      console.log('Generation result:', data);
      
      toast({
        title: "Success!",
        description: `Generated online descriptions for ${data.success} applications.`,
      });

    } catch (error) {
      console.error('Error generating descriptions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate descriptions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateDescriptions}
        className="w-full md:w-auto"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating Descriptions..." : "Generate 10 Online Descriptions"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Click to generate detailed online descriptions for applications that don't have them yet.
      </p>
    </div>
  );
};