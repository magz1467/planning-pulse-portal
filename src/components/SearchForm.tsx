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
    <div className="w-full max-w-3xl">
      <SearchTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        disabled={isSearching}
      />
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="text-sm text-gray-500 mb-0.5 block">Search location</label>
          <PostcodeSearch
            onSelect={setPostcode}
            placeholder="Enter a postcode"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-6 font-semibold text-lg tracking-wide transition-all duration-200 shadow-sm hover:shadow-md mt-2 hover:bg-primary-dark"
          disabled={isSearching || !postcode.trim()}
        >
          {isSearching ? 'Searching...' : 'Show planning applications'}
        </Button>
      </form>
    </div>
  );
};