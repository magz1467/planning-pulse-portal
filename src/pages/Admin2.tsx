import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatusDisplay } from '@/components/admin/StatusDisplay';
import { AutomationControl } from '@/components/admin/AutomationControl';
import { ManualProcessing } from '@/components/admin/ManualProcessing';

export default function Admin2() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingBatchSize, setProcessingBatchSize] = useState<number | null>(null);
  const [totalAITitles, setTotalAITitles] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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