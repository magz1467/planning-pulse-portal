import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostcodeSearch } from "./PostcodeSearch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'completed'>('recent');
  const [postcode, setPostcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveSearch = async (postcode: string, status: string) => {
    try {
      const { data: auth } = await supabase.auth.getSession();
      const isLoggedIn = !!auth.session;

      const { error } = await supabase
        .from('Searches')
        .insert([
          {
            "Post Code": postcode,
            "Status": status,
            "User_logged_in": isLoggedIn
          }
        ]);

      if (error) {
        console.error('Error saving search:', error);
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setIsSearching(true);
    try {
      await saveSearch(postcode.trim(), activeTab);
      navigate('/map', { 
        state: { 
          postcode: postcode.trim(),
          tab: activeTab 
        } 
      });
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline" 
          className={`flex-1 ${
            activeTab === 'recent' 
              ? 'bg-primary-light text-primary hover:bg-primary hover:text-white' 
              : 'hover:bg-primary-light hover:text-primary'
          }`}
          onClick={() => setActiveTab('recent')}
          disabled={isSearching}
        >
          Recent
        </Button>
        <Button 
          variant="outline" 
          className={`flex-1 ${
            activeTab === 'completed' 
              ? 'bg-primary-light text-primary hover:bg-primary hover:text-white' 
              : 'hover:bg-primary-light hover:text-primary'
          }`}
          onClick={() => setActiveTab('completed')}
          disabled={isSearching}
        >
          Completed
        </Button>
      </div>
      
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
          className="w-full bg-primary hover:bg-primary-dark text-white py-6"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Show planning applications'}
        </Button>
      </form>
    </div>
  );
};