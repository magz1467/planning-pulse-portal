import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin2() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingBatchSize, setProcessingBatchSize] = useState<number | null>(null);
  const [totalAITitles, setTotalAITitles] = useState<number | null>(null);
  
  useEffect(() => {
    fetchTotalAITitles();
  }, []);

  const fetchTotalAITitles = async () => {
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .not('ai_title', 'is', null);
    
    setTotalAITitles(count);
  };

  const handleGenerateTitles = async (batchSize: number) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setProcessingBatchSize(batchSize);
      
      toast({
        title: "Generating titles...",
        description: `This may take a few minutes for ${batchSize} records`,
      });

      console.log(`Starting title generation for batch size: ${batchSize}`);
      const { data, error } = await supabase.functions.invoke('generate-titles-manual', {
        body: { limit: batchSize }
      });
      
      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Edge function response:', data);

      // Verify the results by querying the database
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .not('ai_title', 'is', null);

      console.log(`Total applications with AI titles: ${count}`);
      setTotalAITitles(count);

      toast({
        title: "Success!",
        description: `${data.message}. Total applications with AI titles: ${count}`,
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
      setProcessingBatchSize(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">Current Status</h2>
          <p className="text-sm text-muted-foreground">
            Total applications with AI titles: {totalAITitles !== null ? totalAITitles.toLocaleString() : 'Loading...'}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manual Processing</h2>
          
          <div>
            <Button 
              onClick={() => handleGenerateTitles(50)}
              className="w-full md:w-auto"
              disabled={isGenerating}
              variant={processingBatchSize === 50 ? "secondary" : "default"}
            >
              {processingBatchSize === 50 ? "Processing..." : "Generate 50 AI Titles"}
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
              variant={processingBatchSize === 100 ? "secondary" : "default"}
            >
              {processingBatchSize === 100 ? "Processing..." : "Generate 100 AI Titles"}
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
              variant={processingBatchSize === 250 ? "secondary" : "default"}
            >
              {processingBatchSize === 250 ? "Processing..." : "Generate 250 AI Titles"}
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
              variant={processingBatchSize === 500 ? "secondary" : "default"}
            >
              {processingBatchSize === 500 ? "Processing..." : "Generate 500 AI Titles"}
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