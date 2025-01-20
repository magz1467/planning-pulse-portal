import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { supabase } from "@/integrations/supabase/client";

interface SearchFormProps {
  activeTab?: string;
  onSearch?: (postcode: string) => void;
}

export const SearchForm = ({ activeTab, onSearch }: SearchFormProps) => {
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();

  const logSearch = async (postcode: string) => {
    try {
      console.log('Logging search from SearchForm:', {
        postcode,
        status: activeTab
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('Searches').insert({
        'Post Code': postcode,
        'Status': activeTab,
        'User_logged_in': !!session?.user
      });

      if (error) {
        console.error('Error logging search:', error);
      } else {
        console.log('Search logged successfully from SearchForm');
      }
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode.trim()) {
      return;
    }

    const trimmedPostcode = postcode.trim();

    if (onSearch) {
      onSearch(trimmedPostcode);
    }

    try {
      await logSearch(trimmedPostcode);
      
      navigate('/applications/dashboard/map', { 
        state: { 
          postcode: trimmedPostcode,
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