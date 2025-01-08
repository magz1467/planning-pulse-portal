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
      const { data, error: functionError } = await supabase.functions.invoke('scrape-planning-portal', {
        body: { 
          url: "https://example-planning-portal.com/application/123",
          applicationId: 123,
          lpaAppNo: "TEST/123",
          lpaName: "Test Council",
          description: "Test planning application"
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
        Click to test the planning portal scraping functionality
      </p>
    </div>
  );
};