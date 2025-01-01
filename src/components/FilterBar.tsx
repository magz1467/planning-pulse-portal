import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpDown } from "lucide-react";
import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./map/filter/StatusFilter";
import { ViewToggle } from "./map/filter/ViewToggle";

interface FilterBarProps {
  onFilterChange?: (filterType: string, value: string) => void;
  onSortChange?: (sortType: 'closingSoon' | 'newest' | null) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  activeSort?: 'closingSoon' | 'newest' | null;
  isMapView?: boolean;
  onToggleView?: () => void;
  applications?: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
}

export const FilterBar = ({
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort = null,
  isMapView = true,
  onToggleView,
  applications = [],
  statusCounts
}: FilterBarProps) => {
  const isMobile = useIsMobile();

  const handleSortedApplications = (sortedApps: Application[]) => {
    // Find which sort type was applied based on the order
    let appliedSortType: 'closingSoon' | 'newest' | null = null;
    
    if (sortedApps.length > 1) {
      const first = sortedApps[0];
      const last = sortedApps[sortedApps.length - 1];
      
      if (first.valid_date && last.valid_date) {
        const firstDate = new Date(first.valid_date);
        const lastDate = new Date(last.valid_date);
        if (firstDate > lastDate) {
          appliedSortType = 'newest';
        }
      }
      
      if (first.last_date_consultation_comments && last.last_date_consultation_comments) {
        const firstDate = new Date(first.last_date_consultation_comments);
        const lastDate = new Date(last.last_date_consultation_comments);
        if (firstDate < lastDate) {
          appliedSortType = 'closingSoon';
        }
      }
    }
    
    if (onSortChange) {
      onSortChange(appliedSortType);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2 flex-1">
        <StatusFilter
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          isMobile={isMobile}
          applications={applications}
          statusCounts={statusCounts}
        />

        <SortDropdown
          applications={applications}
          onSortedApplications={handleSortedApplications}
        >
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {activeSort === 'closingSoon' ? 'Closing Soon' : 
             activeSort === 'newest' ? 'Newest' : 'Sort'}
          </Button>
        </SortDropdown>
      </div>

      {isMobile && onToggleView && (
        <ViewToggle isMapView={isMapView} onToggle={onToggleView} />
      )}
    </div>
  );
};