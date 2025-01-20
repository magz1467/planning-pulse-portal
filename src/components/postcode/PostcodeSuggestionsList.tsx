import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface PostcodeSuggestionsListProps {
  open: boolean;
  search: string;
  isLoading: boolean;
  suggestions: Array<{
    postcode: string;
    address?: string;
    admin_district?: string;
    country?: string;
  }>;
  onSelect: (postcode: string) => Promise<void>;
}

export const PostcodeSuggestionsList = ({
  open,
  search,
  isLoading,
  suggestions,
  onSelect,
}: PostcodeSuggestionsListProps) => {
  if (!open || search.length < 2) return null;

  return (
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
                  onSelect={() => onSelect(suggestion.postcode)}
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
  );
};