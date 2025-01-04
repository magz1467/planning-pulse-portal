import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatusDisplay } from '@/components/admin/StatusDisplay';
import { AutomationControl } from '@/components/admin/AutomationControl';
import { ManualProcessing } from '@/components/admin/ManualProcessing';
import { testEdgeFunction } from "@/utils/debugUtils";
import { Button } from "@/components/ui/button";

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

  const handleTestEdgeFunction = async () => {
    console.log('Testing edge function connection...');
    const result = await testEdgeFunction();
    
    if (result.error) {
      toast({
        title: "Edge Function Test Failed",
        description: "Check console for details",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Edge Function Test Successful",
        description: "Check console for response details"
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Debug Tools</h2>
          <div>
            <Button 
              onClick={handleTestEdgeFunction}
              variant="outline"
              size="sm"
              className="mb-4"
            >
              Test Edge Function
            </Button>
            <p className="text-sm text-muted-foreground">
              Tests the connection to edge functions. Check console for detailed output.
            </p>
          </div>
        </div>

        <StatusDisplay totalAITitles={totalAITitles} />
        <AutomationControl isGenerating={isGenerating} />
        <ManualProcessing 
          isGenerating={isGenerating}
          processingBatchSize={processingBatchSize}
          onGenerate={handleGenerateTitles}
        />
      </div>
    </div>
  );
}