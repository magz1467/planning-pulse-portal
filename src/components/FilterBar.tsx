import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/components/map/filter/FilterDropdown";
import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter, ArrowUpDown, Map, List } from "lucide-react";
import { Application } from "@/types/planning";

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
}

export const FilterBar = ({
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort = null,
  isMapView = true,
  onToggleView,
  applications = []
}: FilterBarProps) => {
  const isMobile = useIsMobile();

  // Calculate counts for each status
  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {
      "Under Review": 0,
      "Approved": 0,
      "Declined": 0,
      "Other": 0
    };
    
    if (applications && applications.length > 0) {
      applications.forEach(app => {
        const appStatus = app.status?.trim() || '';
        
        if (!appStatus) {
          counts['Other']++;
          return;
        }

        const statusLower = appStatus.toLowerCase();
        if (statusLower.includes('under review')) {
          counts['Under Review']++;
        } else if (statusLower.includes('approved')) {
          counts['Approved']++;
        } else if (statusLower.includes('declined') || statusLower.includes('refused')) {
          counts['Declined']++;
        } else {
          counts['Other']++;
        }
      });
    }

    console.log('Status counts:', counts);
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2 flex-1">
        <FilterDropdown
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          isMobile={isMobile}
          applications={applications}
          statusCounts={statusCounts}
        >
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </FilterDropdown>

        <SortDropdown
          onSortChange={onSortChange}
          activeSort={activeSort}
          isMobile={isMobile}
        >
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </SortDropdown>
      </div>

      {isMobile && onToggleView && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleView}
            className={isMapView ? "text-primary" : "text-gray-500"}
          >
            <Map className="h-5 w-5 mr-1" />
            Map
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleView}
            className={!isMapView ? "text-primary" : "text-gray-500"}
          >
            <List className="h-5 w-5 mr-1" />
            List
          </Button>
        </div>
      )}
    </div>
  );
};