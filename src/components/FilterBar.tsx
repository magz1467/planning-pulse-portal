import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/components/map/filter/FilterDropdown";
import { SortDropdown } from "@/components/map/filter/SortDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter, ArrowUpDown, Map, List } from "lucide-react";
import { Application } from "@/types/planning";
import { useEffect, useState } from "react";

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
  const [statusCounts, setStatusCounts] = useState({
    "Under Review": 0,
    "Approved": 0,
    "Declined": 0,
    "Other": 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!applications) {
      console.log('No applications provided');
      setIsLoading(false);
      return;
    }

    console.log('Processing', applications.length, 'applications');
    const counts = {
      "Under Review": 0,
      "Approved": 0,
      "Declined": 0,
      "Other": 0
    };

    applications.forEach(app => {
      if (!app) return;

      const status = (app.status || '').trim().toLowerCase();
      
      if (!status) {
        counts['Other']++;
      } else if (status.includes('under review') || status.includes('under consideration')) {
        counts['Under Review']++;
      } else if (status.includes('approved')) {
        counts['Approved']++;
      } else if (status.includes('declined') || status.includes('refused')) {
        counts['Declined']++;
      } else {
        counts['Other']++;
      }
    });

    console.log('Final status counts:', counts);
    setStatusCounts(counts);
    setIsLoading(false);
  }, [applications]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-2 flex-1">
        <FilterDropdown
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          isMobile={isMobile}
          applications={applications}
          statusCounts={statusCounts}
          isLoading={isLoading}
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