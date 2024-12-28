import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { PostcodeSearch } from '@/components/PostcodeSearch';

interface PostcodeSectionProps {
  initialPostcode?: string;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
}

export const PostcodeSection = ({ initialPostcode = '', onPostcodeUpdate }: PostcodeSectionProps) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      await onPostcodeUpdate(trimmedPostcode);
      // Only show success toast if the promise resolves successfully
      toast({
        title: "Success",
        description: "Your postcode has been updated",
      });
    } catch (error) {
      console.error('Error updating postcode:', error);
      // Show error toast if the promise rejects
      toast({
        title: "Error",
        description: "Failed to update postcode. Please try again.",
        variant: "destructive",
      });
      return; // Exit early on error to prevent state updates
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostcodeSelect = (selectedPostcode: string) => {
    setPostcode(selectedPostcode);
  };

  return (
    <div>
      <label className="text-sm text-gray-500">Post Code</label>
      <div className="flex gap-2">
        <PostcodeSearch
          onSelect={handlePostcodeSelect}
          placeholder="Enter your postcode"
          className="max-w-[200px]"
        />
        <Button 
          variant="outline" 
          size="default"
          onClick={handlePostcodeSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : (initialPostcode ? 'Update' : 'Save')}
        </Button>
      </div>
    </div>
  );
};