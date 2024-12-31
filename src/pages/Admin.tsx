import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { toast } = useToast();

  const handleGenerateTitles = async () => {
    try {
      toast({
        title: "Generating titles...",
        description: "This may take a few minutes",
      });

      const { data, error } = await supabase.functions.invoke('generate-titles-manual');
      
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
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <Button 
        onClick={handleGenerateTitles}
        className="w-full md:w-auto"
      >
        Generate AI Titles for Applications
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        This will generate AI titles for up to 50 applications that don't have titles yet.
      </p>
    </div>
  );
}