import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useAddressSuggestions } from "@/hooks/use-address-suggestions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface PostcodeSearchProps {
  onSelect: (postcode: string) => void;
  placeholder?: string;
  className?: string;
}

export const PostcodeSearch = ({ onSelect, placeholder = "Search location", className = "" }: PostcodeSearchProps) => {
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
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleInputChange}
          className="w-full pl-4 pr-10 py-2"
          onFocus={() => search.length >= 2 && setOpen(true)}
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={handleSubmit}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {open && search.length >= 2 && (
        <div className="absolute z-[9999] w-full mt-1">
          <Command className="rounded-lg border shadow-md bg-white">
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading suggestions...</CommandEmpty>
              ) : suggestions.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.postcode}
                      onSelect={() => handleSelect(suggestion.postcode)}
                      className="hover:bg-primary/10"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{suggestion.postcode}</span>
                        <span className="text-sm text-gray-500">
                          {suggestion.address || `${suggestion.admin_district}, ${suggestion.country}`}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};