import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeSort: 'closingSoon' | 'newest' | null;
  isMobile: boolean;
}

export const SortDropdown = ({ onSortChange, activeSort, isMobile }: SortDropdownProps) => {
  const getSortButtonText = () => {
    switch (activeSort) {
      case 'closingSoon':
        return 'Closing Soon';
      case 'newest':
        return 'Newest';
      default:
        return 'Sort';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className={`${isMobile ? 'px-3' : 'w-[180px]'} justify-between`}
        >
          <span className="truncate">{getSortButtonText()}</span>
          <ArrowUpDown className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => onSortChange(null)}
          className="cursor-pointer"
        >
          Default
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange('closingSoon')}
          className="cursor-pointer"
        >
          Closing Soon
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange('newest')}
          className="cursor-pointer"
        >
          Newest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};