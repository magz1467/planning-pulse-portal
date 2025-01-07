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

export async function getApplicationById(id: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
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

export async function getApplicationComments(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
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

export async function addApplicationComment(applicationId: string, comment: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          application_id: applicationId,
          user_id: userId,
          content: comment
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