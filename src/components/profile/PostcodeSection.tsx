import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { PostcodeSearch } from '@/components/PostcodeSearch';
import { Trash, PlusCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface PostcodeSectionProps {
  initialPostcode?: string;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
}

export const PostcodeSection = ({ initialPostcode = '', onPostcodeUpdate }: PostcodeSectionProps) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postcodes, setPostcodes] = useState<Array<{ id: number; postcode: string }>>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPostcodes();
  }, []);

  const fetchPostcodes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_postcodes')
        .select('id, postcode')
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
      const { error } = await supabase
        .from('user_postcodes')
        .insert({ postcode: trimmedPostcode });

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

  const handlePostcodeSelect = (selectedPostcode: string) => {
    setPostcode(selectedPostcode);
  };

  return (
    <div>
      <label className="text-sm text-gray-500">Post Codes</label>
      <div className="space-y-2">
        {postcodes.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-gray-50 rounded-md">{item.postcode}</div>
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
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Postcode
          </Button>
        )}
      </div>
    </div>
  );
};