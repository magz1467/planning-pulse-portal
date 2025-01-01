import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Application } from "@/types/planning";

interface SortDropdownProps {
  children?: React.ReactNode;
  applications?: Application[];
  onSortedApplications?: (sortedApps: Application[]) => void;
}

export const SortDropdown = ({ children, applications = [], onSortedApplications }: SortDropdownProps) => {
  const handleSort = (sortType: 'closingSoon' | 'newest' | null) => {
    if (!applications || !onSortedApplications) return;
    
    let sortedApps = [...applications];
    
    if (sortType) {
      sortedApps.sort((a, b) => {
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
    }

    onSortedApplications(sortedApps);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
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