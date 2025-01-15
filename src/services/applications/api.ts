import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export async function getApplicationsWithinRadius(
  center_lat: number,
  center_lng: number,
  radius_meters: number,
  page_size: number = 100,
  page_number: number = 0
) {
  try {
    console.log('Fetching applications with params:', {
      center_lat,
      center_lng,
      radius_meters,
      page_size,
      page_number
    });

    const { data, error } = await supabase.rpc(
      'get_applications_with_counts',
      {
        center_lat,
        center_lng,
        radius_meters,
        page_size,
        page_number
      }
    );

    if (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No applications found in radius');
      return [];
    }

    console.log(`Found ${data.length} applications`);
    return data;
  } catch (error) {
    console.error('Error in getApplicationsWithinRadius:', error);
    toast({
      title: "Error fetching applications",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }
}

export async function getApplicationById(id: number) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', id)
      .single();

    if (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error fetching application",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getApplicationById:', error);
    toast({
      title: "Error fetching application",
      description: "Please try again later", 
      variant: "destructive"
    });
    return null;
  }
}

export async function getApplicationComments(applicationId: number) {
  try {
    const { data, error } = await supabase
      .from('Comments')  // Changed from 'comments' to 'Comments'
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error fetching comments",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getApplicationComments:', error);
    toast({
      title: "Error fetching comments",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }
}

export async function addApplicationComment(applicationId: number, comment: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('Comments')  // Changed from 'comments' to 'Comments'
      .insert([
        {
          application_id: applicationId,
          user_id: userId,
          comment: comment
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addApplicationComment:', error);
    toast({
      title: "Error adding comment",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }
}

// Add missing exports
export const fetchApplicationsFromSupabase = getApplicationsWithinRadius;
export const fetchApplicationsCountFromSupabase = getApplicationsWithinRadius;
export const fetchStatusCounts = getApplicationsWithinRadius;