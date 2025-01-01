import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { useState } from "react";

interface SortDropdownProps {
  applications: Application[];
  onSortedApplications: (sortedApps: Application[]) => void;
  children?: React.ReactNode;
}

export const SortDropdown = ({ applications, onSortedApplications, children }: SortDropdownProps) => {
  const [currentSort, setCurrentSort] = useState<'closingSoon' | 'newest' | null>(null);
  const isMobile = useIsMobile();

  const handleSort = (sortType: 'closingSoon' | 'newest' | null) => {
    setCurrentSort(sortType);
    
    const sortedApps = [...applications].sort((a, b) => {
      if (sortType === 'newest') {
        const dateA = a.valid_date ? new Date(a.valid_date) : new Date(0);
        const dateB = b.valid_date ? new Date(b.valid_date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      } else if (sortType === 'closingSoon') {
        const dateA = a.last_date_consultation_comments ? new Date(a.last_date_consultation_comments) : new Date(0);
        const dateB = b.last_date_consultation_comments ? new Date(b.last_date_consultation_comments) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });

    onSortedApplications(sortedApps);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {currentSort === 'closingSoon' ? 'Closing Soon' : 
             currentSort === 'newest' ? 'Newest' : 'Sort'}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSort(null)}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('newest')}>
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('closingSoon')}>
          Closing Soon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};