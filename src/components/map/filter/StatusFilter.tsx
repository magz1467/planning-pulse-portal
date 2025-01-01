import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Application } from "@/types/planning";
import { FilterDropdown } from "./FilterDropdown";

interface StatusFilterProps {
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilters?: {
    status?: string;
    type?: string;
  };
  applications?: Application[];
  isMobile: boolean;
}

export const StatusFilter = ({
  onFilterChange,
  activeFilters = {},
  applications = [],
  isMobile
}: StatusFilterProps) => {
  // Create a Map to store the counts
  const getStatusCounts = () => {
    const counts = new Map([
      ['Under Review', 0],
      ['Approved', 0],
      ['Declined', 0],
      ['Other', 0]
    ]);

    if (!Array.isArray(applications)) {
      console.warn('Applications is not an array:', applications);
      return Object.fromEntries(counts);
    }

    applications.forEach(app => {
      if (!app || typeof app.status !== 'string') {
        counts.set('Other', counts.get('Other')! + 1);
        return;
      }

      const status = app.status.trim();
      
      // Log each application status for debugging
      console.log('Processing application status:', status);

      if (!status) {
        counts.set('Other', counts.get('Other')! + 1);
        return;
      }

      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('under review') || 
          statusLower.includes('under consideration') ||
          statusLower.includes('pending')) {
        counts.set('Under Review', counts.get('Under Review')! + 1);
      } else if (statusLower.includes('approved') || 
                 statusLower.includes('granted')) {
        counts.set('Approved', counts.get('Approved')! + 1);
      } else if (statusLower.includes('declined') || 
                 statusLower.includes('refused') || 
                 statusLower.includes('rejected')) {
        counts.set('Declined', counts.get('Declined')! + 1);
      } else {
        counts.set('Other', counts.get('Other')! + 1);
      }
    });

    // Convert Map to plain object
    const statusCounts = Object.fromEntries(counts);
    
    // Log the final counts
    console.log('Final status counts:', statusCounts);
    console.log('Total applications processed:', applications.length);
    
    return statusCounts;
  };

  const statusCounts = getStatusCounts();

  return (
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
  );
};