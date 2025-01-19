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
      navigate('/applications/dashboard/map', { 
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <PostcodeSearch
        onSelect={setPostcode}
        placeholder="Enter postcode"
        className="flex-1"
      />
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg font-semibold rounded-xl shadow-sm"
      >
        <Search className="w-5 h-5 mr-2" />
        Show planning applications
      </Button>
    </form>
  );
};