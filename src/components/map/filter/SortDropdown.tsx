import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Application } from "@/types/planning";
import { Check } from "lucide-react";

interface SortDropdownProps {
  children?: React.ReactNode;
  applications?: Application[];
  onSortedApplications?: (sortedApps: Application[], sortType: 'closingSoon' | 'newest' | null) => void;
  activeSort?: 'closingSoon' | 'newest' | null;
}

export const SortDropdown = ({ children, applications = [], onSortedApplications, activeSort }: SortDropdownProps) => {
  const handleSort = (sortType: 'closingSoon' | 'newest' | null) => {
    if (!applications || !onSortedApplications) return;
    
    let sortedApps = [...applications];
    
    if (sortType === 'newest') {
      sortedApps.sort((a, b) => {
        const dateA = a.valid_date ? new Date(a.valid_date) : new Date(0);
        const dateB = b.valid_date ? new Date(b.valid_date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortType === 'closingSoon') {
      sortedApps.sort((a, b) => {
        const dateA = a.last_date_consultation_comments ? new Date(a.last_date_consultation_comments) : new Date(0);
        const dateB = b.last_date_consultation_comments ? new Date(b.last_date_consultation_comments) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
    }

    onSortedApplications(sortedApps, sortType);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSort(null)} className="flex items-center justify-between">
          Default
          {activeSort === null && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('newest')} className="flex items-center justify-between">
          Newest
          {activeSort === 'newest' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('closingSoon')} className="flex items-center justify-between">
          Closing Soon
          {activeSort === 'closingSoon' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};