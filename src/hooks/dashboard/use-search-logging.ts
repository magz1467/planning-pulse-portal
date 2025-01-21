import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../use-toast";

export const useSearchLogging = () => {
  const { toast } = useToast();

  const logSearch = async (
    postcode: string,
    initialTab: string,
    loadTime: number
  ) => {
    try {
      console.log('Logging search:', {
        postcode,
        status: initialTab,
        loadTime,
        timestamp: new Date().toISOString()
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('Searches').insert({
        'Post Code': postcode,
        'Status': initialTab,
        'User_logged_in': !!session?.user,
        'load_time': loadTime
      });

      if (error) {
        console.error('Search logging error:', error);
        toast({
          title: "Analytics Error",
          description: "Your search was processed but we couldn't log it. This won't affect your results.",
          variant: "default",
        });
      } else {
        console.log('Search logged successfully');
      }
    } catch (error) {
      console.error('Search logging error:', error);
    }
  };

  return { logSearch };
};