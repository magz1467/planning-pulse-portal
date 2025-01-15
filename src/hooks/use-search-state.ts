import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSearchState = () => {
  const { toast } = useToast();
  const [postcode, setPostcode] = useState('');
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const logSearch = async (loadTime: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('Searches').insert({
        'Post Code': postcode,
        'Status': 'recent',
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
      }
    } catch (error) {
      console.error('Search logging error:', error);
    }
  };

  const handlePostcodeSelect = useCallback(async (newPostcode: string) => {
    if (!newPostcode) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid postcode to search.",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchStartTime(Date.now());
    setPostcode(newPostcode);
  }, [toast]);

  return {
    postcode,
    isSearching,
    searchStartTime,
    setSearchStartTime,
    setIsSearching,
    handlePostcodeSelect,
    logSearch
  };
};