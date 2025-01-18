import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostcodeSearch } from "./PostcodeSearch";
import { useToast } from "@/hooks/use-toast";
import { useSearchLogger } from "@/hooks/use-search-logger";
import { SearchTabs } from "./search/SearchTabs";

export const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'completed'>('recent');
  const [postcode, setPostcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logSearch } = useSearchLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode.trim()) {
      toast({
        title: "Please enter a postcode",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      await logSearch(postcode.trim(), activeTab);
      navigate('/applications/dashboard/map', { 
        state: { 
          postcode: postcode.trim(),
          tab: activeTab
        } 
      });
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search Error",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
      <SearchTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        disabled={isSearching}
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Search location</label>
          <PostcodeSearch
            onSelect={setPostcode}
            placeholder="Enter a postcode"
          />
        </div>
        
        <Button 
          type="submit" 
          variant="outline"
          className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-6"
          disabled={isSearching || !postcode.trim()}
        >
          {isSearching ? 'Searching...' : 'Show planning applications'}
        </Button>
      </form>
    </div>
  );
};