import { supabase } from "@/integrations/supabase/client";

export const testEdgeFunction = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-applications-with-counts', {
      body: {
        center_lng: -0.1276,
        center_lat: 51.5074,
        radius_meters: 1000,
        page_size: 10,
        page_number: 0
      }
    });

    console.log('Edge Function Response:', {
      data,
      error,
      status: error ? 'ERROR' : 'SUCCESS'
    });

    return { data, error };
  } catch (err) {
    console.error('Edge Function Error:', err);
    return { data: null, error: err };
  }
};