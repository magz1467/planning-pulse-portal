import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PostcodeSearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSubmit: () => void;
}

export const PostcodeSearchInput = ({
  value,
  placeholder,
  onChange,
  onFocus,
  onSubmit,
}: PostcodeSearchInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pr-10"
        onFocus={onFocus}
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-1 top-1/2 -translate-y-1/2"
        onClick={onSubmit}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};