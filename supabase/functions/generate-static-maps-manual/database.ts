import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

export async function getApplicationsWithoutImages(supabase: any, limit: number) {
  const { data: applications, error: fetchError } = await supabase
    .from('applications')
    .select('application_id, centroid')
    .is('image_map_url', null)
    .order('application_id')
    .limit(limit);

  if (fetchError) {
    console.error('Error fetching applications:', fetchError);
    throw fetchError;
  }

  return applications;
}

export async function updateApplicationImage(supabase: any, applicationId: number, imageUrl: string) {
  const { error: updateError } = await supabase
    .from('applications')
    .update({ 
      image_map_url: imageUrl,
      last_updated: new Date().toISOString()
    })
    .eq('application_id', applicationId);

  if (updateError) {
    throw updateError;
  }
}