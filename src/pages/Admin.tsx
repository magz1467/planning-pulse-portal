import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTitles = async (limit: number) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      toast({
        title: "Generating titles...",
        description: `This may take a few minutes for ${limit} records`,
      });

      const { data, error } = await supabase.functions.invoke('generate-titles-manual', {
        body: { limit }
      });
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message || "Titles have been generated successfully",
      });
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div>
          <Button 
            onClick={() => handleGenerateTitles(50)}
            className="w-full md:w-auto"
            disabled={isGenerating}
          >
            Generate 50 AI Titles
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Click to generate AI titles for up to 50 applications that don't have titles yet.
          </p>
        </div>

        <div>
          <Button 
            onClick={() => handleGenerateTitles(100)}
            className="w-full md:w-auto"
            disabled={isGenerating}
          >
            Generate 100 AI Titles
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Click to generate AI titles for up to 100 applications that don't have titles yet.
          </p>
        </div>
      </div>
    </div>
  );
}