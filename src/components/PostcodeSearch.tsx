import { useState } from "react";
import { useAddressSuggestions } from "@/hooks/use-address-suggestions";
import { PostcodeSearchInput } from "./postcode/PostcodeSearchInput";
import { PostcodeSuggestionsList } from "./postcode/PostcodeSuggestionsList";

interface PostcodeSearchProps {
  onSelect: (postcode: string) => void;
  placeholder?: string;
  className?: string;
}

export const PostcodeSearch = ({ 
  onSelect, 
  placeholder = "Search location", 
  className = "" 
}: PostcodeSearchProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  
  const { data: suggestions = [], isLoading } = useAddressSuggestions(search);

  const handleSelect = async (postcode: string) => {
    setSearch(postcode);
    setOpen(false);
    await onSelect(postcode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSubmit = () => {
    if (search) {
      onSelect(search);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <PostcodeSearchInput
        value={search}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => search.length >= 2 && setOpen(true)}
        onSubmit={handleSubmit}
      />
      <PostcodeSuggestionsList
        open={open}
        search={search}
        isLoading={isLoading}
        suggestions={suggestions}
        onSelect={handleSelect}
      />
    </div>
  );
};