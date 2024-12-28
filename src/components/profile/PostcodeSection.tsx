import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { EmailDialog } from '@/components/EmailDialog';
import { PostcodeItem } from './PostcodeItem';
import { AddPostcode } from './AddPostcode';
import { RadiusDialog } from './RadiusDialog';

interface PostcodeSectionProps {
  initialPostcode?: string;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
}

export const PostcodeSection = ({ 
  initialPostcode = '', 
  onPostcodeUpdate 
}: PostcodeSectionProps) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postcodes, setPostcodes] = useState<Array<{ id: number; postcode: string; radius?: string }>>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showRadiusDialog, setShowRadiusDialog] = useState(false);
  const [selectedPostcode, setSelectedPostcode] = useState<string>('');
  const [selectedPostcodeId, setSelectedPostcodeId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPostcodes();
  }, []);

  const fetchPostcodes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_postcodes')
        .select('id, postcode, radius')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPostcodes(data || []);
    } catch (error) {
      console.error('Error fetching postcodes:', error);
      toast({
        title: "Error",
        description: "Failed to load postcodes",
        variant: "destructive",
      });
    }
  };

  const handlePostcodeSubmit = async () => {
    const trimmedPostcode = postcode.trim();
    if (!trimmedPostcode) {
      toast({
        title: "Error",
        description: "Please enter a valid postcode",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('user_postcodes')
        .insert({ 
          postcode: trimmedPostcode,
          user_id: user.id 
        });

      if (error) throw error;

      await fetchPostcodes();
      setShowAddNew(false);
      setPostcode('');
      toast({
        title: "Success",
        description: "Postcode has been added",
      });
    } catch (error) {
      console.error('Error adding postcode:', error);
      toast({
        title: "Error",
        description: "Failed to add postcode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('user_postcodes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPostcodes();
      toast({
        title: "Success",
        description: "Postcode has been removed",
      });
    } catch (error) {
      console.error('Error deleting postcode:', error);
      toast({
        title: "Error",
        description: "Failed to remove postcode",
        variant: "destructive",
      });
    }
  };

  const handleEmailSubmit = async (email: string, radius: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('user_postcodes')
        .update({ radius })
        .eq('postcode', selectedPostcode)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchPostcodes();
      setShowEmailDialog(false);
      toast({
        title: "Success",
        description: `Alert radius updated for ${selectedPostcode}`,
      });
    } catch (error) {
      console.error('Error updating alert radius:', error);
      toast({
        title: "Error",
        description: "Failed to update alert radius",
        variant: "destructive",
      });
    }
  };

  const handleRadiusSubmit = async (radius: string) => {
    if (!selectedPostcodeId) return;
    
    try {
      const { error } = await supabase
        .from('user_postcodes')
        .update({ radius })
        .eq('id', selectedPostcodeId);

      if (error) throw error;

      await fetchPostcodes();
      toast({
        title: "Success",
        description: `Alert radius updated for ${selectedPostcode}`,
      });
    } catch (error) {
      console.error('Error updating alert radius:', error);
      toast({
        title: "Error",
        description: "Failed to update alert radius",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="space-y-1">
        <label className="text-sm text-gray-500">Post Codes</label>
        <p className="text-sm text-gray-500">These are the postcodes you want to be kept aware of for planning applications</p>
      </div>
      <div className="space-y-2 mt-2">
        {postcodes.map((item) => (
          <PostcodeItem
            key={item.id}
            id={item.id}
            postcode={item.postcode}
            radius={item.radius}
            onDelete={handleDelete}
            onAlertClick={(postcode) => {
              setSelectedPostcode(postcode);
              setSelectedPostcodeId(item.id);
              setShowRadiusDialog(true);
            }}
          />
        ))}

        {showAddNew ? (
          <AddPostcode
            postcode={postcode}
            isSubmitting={isSubmitting}
            onPostcodeSelect={setPostcode}
            onSubmit={handlePostcodeSubmit}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAddNew(true)}
          >
            Add Postcode
          </Button>
        )}
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        applicationRef={selectedPostcode}
      />

      <RadiusDialog
        open={showRadiusDialog}
        onOpenChange={setShowRadiusDialog}
        onSubmit={handleRadiusSubmit}
        postcode={selectedPostcode}
      />
    </div>
  );
};