import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  
  // Fetch initial automation status
  useEffect(() => {
    const fetchAutomationStatus = async () => {
      const { data, error } = await supabase
        .from('automation_status')
        .select('is_active')
        .eq('name', 'ai_titles_automation')
        .single();
      
      if (error) {
        console.error('Error fetching automation status:', error);
        return;
      }
      
      setIsAutomationActive(data?.is_active || false);
    };
    
    fetchAutomationStatus();
  }, []);
  
  const handleGenerateTitles = async (batchSize: number) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      toast({
        title: "Generating titles...",
        description: `This may take a few minutes for ${batchSize} records`,
      });

      const { data, error } = await supabase.functions.invoke('generate-titles-manual', {
        body: { limit: batchSize }
      });
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message || "Titles have been generated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAutomation = async () => {
    try {
      const { data, error } = await supabase.rpc(
        'toggle_automation',
        { 
          automation_name: 'ai_titles_automation',
          new_status: !isAutomationActive
        }
      );
      
      if (error) throw error;
      
      setIsAutomationActive(data);
      
      toast({
        title: data ? "Automation Started" : "Automation Stopped",
        description: data 
          ? "The system will process 50 titles every minute"
          : "Title processing automation has been stopped",
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "Error",
        description: "Failed to toggle automation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Automated Processing</h2>
          <div>
            <Button 
              onClick={toggleAutomation}
              className="w-full md:w-auto"
              variant={isAutomationActive ? "destructive" : "default"}
            >
              {isAutomationActive ? "Stop Automation" : "Start Automation"}
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAutomationActive 
                ? "System is automatically processing 50 titles every minute"
                : "Click to start automatic processing of 50 titles every minute"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manual Processing</h2>
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

          <div>
            <Button 
              onClick={() => handleGenerateTitles(250)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 250 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 250 applications that don't have titles yet.
            </p>
          </div>

          <div>
            <Button 
              onClick={() => handleGenerateTitles(500)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 500 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 500 applications that don't have titles yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}