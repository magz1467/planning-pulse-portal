import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ScrapingGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-planning-portal', {
        body: { 
          url: "https://example-planning-portal.com/application/123",
          applicationId: 123
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scraping completed successfully",
      });

      console.log('Scraping response:', data);
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: "Failed to scrape planning portal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Planning Portal Scraping</h3>
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