import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export const TestFunction = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTest = async () => {
    try {
      setIsProcessing(true);
      
      toast({
        title: "Testing function...",
        description: "Calling test endpoint",
      });

      const { data, error } = await supabase.functions.invoke('test-function', {
        method: 'POST'
      });
      
      if (error) {
        console.error('Error from test function:', error);
        throw error;
      }

      console.log('Test function response:', data);

      toast({
        title: "Success!",
        description: `Test function responded: ${data.message}`,
      });
    } catch (error: any) {
      console.error('Error testing function:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to test function. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Test Function</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleTest}
          className="w-full sm:w-auto"
          disabled={isProcessing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Testing...' : 'Test Edge Function'}
        </Button>
      </div>
    </div>
  );
};