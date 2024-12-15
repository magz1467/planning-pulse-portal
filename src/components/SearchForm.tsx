import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'completed'>('recent');

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
        >
          Completed
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Search location</label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Enter a postcode" 
              className="w-full pl-4 pr-10 py-3 border border-primary-light rounded-md focus:ring-primary focus:border-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary-dark text-white py-6">
          Show planning applications
        </Button>
      </div>
    </div>
  );
};