import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ScrapingGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // First get a real application to test with
      const { data: applications, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .not('url_planning_app', 'is', null)
        .limit(1)
        .single();

      if (fetchError) {
        throw new Error('Could not find a valid application to test scraping with');
      }

      if (!applications?.url_planning_app) {
        throw new Error('No application found with a valid planning portal URL');
      }

      console.log('Testing scrape with application:', applications);

      const { data, error: functionError } = await supabase.functions.invoke('scrape-planning-portal', {
        body: { 
          url: applications.url_planning_app,
          applicationId: applications.application_id,
          lpaAppNo: applications.lpa_app_no,
          lpaName: applications.lpa_name,
          description: applications.description
        }
      });

      console.log('Function response:', { data, error: functionError });

      if (functionError) {
        throw new Error(functionError.message || 'Function error occurred');
      }

      if (!data) {
        throw new Error('No data returned from scraping function');
      }

      toast({
        title: "Success",
        description: "Scraping completed successfully",
      });

    } catch (error) {
      console.error('Scraping error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to scrape planning portal';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Planning Portal Scraping</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={handleScrape}
        disabled={isProcessing}
        className="w-full md:w-auto"
      >
        {isProcessing ? "Processing..." : "Test Scrape Planning Portal"}
      </Button>
      
      <p className="mt-2 text-sm text-muted-foreground">
        Click to test the planning portal scraping functionality using a real application
      </p>
    </div>
  );
};