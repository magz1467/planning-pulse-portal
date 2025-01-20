import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSearchLogger = () => {
  const { toast } = useToast();

  const logSearch = async (params: {
    postcode: string;
    status?: string;
    loadTime?: number;
    source?: string;
  }) => {
    try {
      const { postcode, status, loadTime, source } = params;
      
      console.log(`Logging search from ${source}:`, {
        postcode,
        status,
        loadTime,
        timestamp: new Date().toISOString()
      });

      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('Searches').insert({
        "Post Code": postcode,
        Status: status,
        User_logged_in: !!session?.user,
        load_time: loadTime
      });

      if (error) {
        console.error('Error logging search:', error);
        toast({
          title: "Analytics Error",
          description: "Your search was processed but we couldn't log it. This won't affect your results.",
          variant: "default",
        });
      } else {
        console.log(`Search logged successfully from ${source}`);
      }
    } catch (error) {
      console.error('Search logging error:', error);
      toast({
        title: "Analytics Error",
        description: "Your search was processed but we couldn't log it. This won't affect your results.",
        variant: "default",
      });
    }
  };

  return { logSearch };
};