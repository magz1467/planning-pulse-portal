import { Button } from "@/components/ui/button";
import { PostcodeSearch } from '@/components/PostcodeSearch';

interface AddPostcodeProps {
  postcode: string;
  isSubmitting: boolean;
  onPostcodeSelect: (postcode: string) => void;
  onSubmit: () => void;
}

export const AddPostcode = ({
  postcode,
  isSubmitting,
  onPostcodeSelect,
  onSubmit
}: AddPostcodeProps) => {
  return (
    <div className="flex gap-2">
      <PostcodeSearch
        onSelect={onPostcodeSelect}
        placeholder="Enter your postcode"
        className="flex-1"
      />
      <Button 
        variant="outline" 
        size="default"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </Button>
    </div>
  );
};