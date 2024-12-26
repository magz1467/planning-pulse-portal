import { supabase } from "@/integrations/supabase/client";

export const triggerDevelopmentsUpdate = async () => {
  try {
    console.log('Triggering developments update...');
    const { data, error } = await supabase.functions.invoke('update-developments', {
      method: 'POST'
    });

    if (error) {
      console.error('Error triggering update:', error);
      return;
    }

    console.log('Update response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}