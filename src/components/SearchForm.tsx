import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'completed'>('recent');
  const [postcode, setPostcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      // Navigate to map view with postcode
      navigate('/map', { 
        state: { 
          postcode: postcode.trim(),
          tab: activeTab 
        } 
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error performing search",
        description: "Please try again later",
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
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Enter a postcode" 
              className="w-full pl-4 pr-10 py-3 border border-primary-light rounded-md focus:ring-primary focus:border-primary"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              disabled={isSearching}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
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