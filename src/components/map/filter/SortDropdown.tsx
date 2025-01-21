import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { SortType } from "@/hooks/use-sort-applications";

interface SortDropdownProps {
  children?: React.ReactNode;
  activeSort?: SortType;
  onSortChange?: (sortType: SortType) => void;
}

export const SortDropdown = ({ 
  children, 
  activeSort, 
  onSortChange 
}: SortDropdownProps) => {
  const handleSort = (sortType: SortType) => {
    if (!onSortChange) return;
    onSortChange(sortType);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border border-gray-200 shadow-lg rounded-md z-50"
      >
        <DropdownMenuItem 
          onClick={() => handleSort(null)} 
          className="flex items-center justify-between hover:bg-gray-100 cursor-pointer"
        >
          Default
          {activeSort === null && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSort('newest')} 
          className="flex items-center justify-between hover:bg-gray-100 cursor-pointer"
        >
          Newest
          {activeSort === 'newest' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSort('closingSoon')} 
          className="flex items-center justify-between hover:bg-gray-100 cursor-pointer"
        >
          Closing Soon
          {activeSort === 'closingSoon' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSort('impact')} 
          className="flex items-center justify-between hover:bg-gray-100 cursor-pointer"
        >
          Highest Impact
          {activeSort === 'impact' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};