import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface PostcodeSectionProps {
  initialPostcode?: string;
  onPostcodeUpdate: (postcode: string) => Promise<void>;
}

export const PostcodeSection = ({ initialPostcode = '', onPostcodeUpdate }: PostcodeSectionProps) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const { toast } = useToast();

  const handlePostcodeSubmit = async () => {
    const trimmedPostcode = postcode.trim();
    if (!trimmedPostcode) return;

    try {
      await onPostcodeUpdate(trimmedPostcode);
      toast({
        title: "Success",
        description: "Your postcode has been updated",
      });
    } catch (error) {
      console.error('Error updating postcode:', error);
      toast({
        title: "Error",
        description: "Failed to update postcode",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <label className="text-sm text-gray-500">Post Code</label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter your postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="max-w-[200px]"
        />
        <Button 
          variant="outline" 
          size="default"
          onClick={handlePostcodeSubmit}
        >
          {initialPostcode ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};