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
  const [trialData, setTrialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTotalAITitles();
    fetchTrialData();
  }, []);

  const fetchTotalAITitles = async () => {
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .not('ai_title', 'is', null);
    
    setTotalAITitles(count);
  };

  const fetchTrialData = async () => {
    try {
      setLoading(true);
      
      // First fetch the trial data
      const { data: response, error: fetchError } = await supabase.functions.invoke('fetch-trial-data');
      
      if (fetchError) throw fetchError;

      // Then get the data from the table
      const { data: applications, error: dbError } = await supabase
        .from('trial_application_data')
        .select('*');

      if (dbError) throw dbError;
      
      setTrialData(applications || []);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Trial Planning Applications Data</h2>
          {loading && <div className="p-4">Loading trial data...</div>}
          {error && <div className="p-4 text-red-500">Error loading trial data: {error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Reference</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Submission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {trialData.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{app.application_reference}</td>
                      <td className="px-4 py-2 border">{app.description}</td>
                      <td className="px-4 py-2 border">{app.status}</td>
                      <td className="px-4 py-2 border">{app.address}</td>
                      <td className="px-4 py-2 border">
                        {app.submission_date && new Date(app.submission_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}