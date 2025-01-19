import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { PostcodeSearch } from "@/components/PostcodeSearch";

interface SearchFormProps {
  activeTab?: string;
  onSearch?: (postcode: string) => void;
}

export const SearchForm = ({ activeTab, onSearch }: SearchFormProps) => {
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode.trim()) {
      return;
    }

    if (onSearch) {
      onSearch(postcode.trim());
    }

    try {
      navigate('/map', { 
        state: { 
          postcode: postcode.trim(),
          tab: activeTab
        }
      });
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <PostcodeSearch
        onSelect={setPostcode}
        placeholder="Enter postcode"
        className="flex-1"
      />
      <Button type="submit" className="bg-primary hover:bg-primary-dark">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
};