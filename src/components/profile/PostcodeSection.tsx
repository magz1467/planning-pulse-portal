import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { PostcodeSearch } from '@/components/PostcodeSearch';
import { Trash, Bell } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { EmailDialog } from '@/components/EmailDialog';

interface PostcodeSectionProps {
  initialPostcode?: string;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
}

export const PostcodeSection = ({ initialPostcode = '', onPostcodeUpdate }: PostcodeSectionProps) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postcodes, setPostcodes] = useState<Array<{ id: number; postcode: string; radius?: string }>>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPostcode, setSelectedPostcode] = useState<string>('');
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
      // Get the current user
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

  const handlePostcodeSelect = (selectedPostcode: string) => {
    setPostcode(selectedPostcode);
  };

  return (
    <div>
      <label className="text-sm text-gray-500">Post Codes</label>
      <div className="space-y-2">
        {postcodes.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span>{item.postcode}</span>
                {item.radius && (
                  <span className="text-sm text-gray-500">
                    Alerts: {item.radius === "1000" ? "1km" : `${item.radius}m`}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedPostcode(item.postcode);
                setShowEmailDialog(true);
              }}
              className="h-9 w-9"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item.id)}
              className="h-9 w-9"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {showAddNew ? (
          <div className="flex gap-2">
            <PostcodeSearch
              onSelect={handlePostcodeSelect}
              placeholder="Enter your postcode"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="default"
              onClick={handlePostcodeSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </div>
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
    </div>
  );
};