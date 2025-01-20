import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useSearchLogger } from "@/hooks/use-search-logger";

interface SearchFormProps {
  activeTab?: string;
  onSearch?: (postcode: string) => void;
}

export const SearchForm = ({ activeTab, onSearch }: SearchFormProps) => {
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();
  const { logSearch } = useSearchLogger();

  const handleSearch = async (searchPostcode: string) => {
    setPostcode(searchPostcode);
    
    await logSearch({
      postcode: searchPostcode,
      status: activeTab,
      source: 'SearchForm'
    });

    if (onSearch) {
      onSearch(searchPostcode);
    } else {
      navigate(`/map?postcode=${encodeURIComponent(searchPostcode)}`);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <PostcodeSearch
          onSelect={handleSearch}
          placeholder="Enter your postcode"
          className="w-full"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};