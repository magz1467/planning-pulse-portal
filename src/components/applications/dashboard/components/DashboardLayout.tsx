import { DashboardHeader } from "./DashboardHeader";
import { SearchSection } from "./SearchSection";
import { LoadingOverlay } from "./LoadingOverlay";
import { MapSection } from "./MapSection";
import { SidebarSection } from "./SidebarSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { Application } from "@/types/planning";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState, memo } from "react";

interface DashboardLayoutProps {
  selectedId: number | null;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  isMapView: boolean;
  setIsMapView: (value: boolean) => void;
  postcode: string;
  coordinates: [number, number];
  isLoading: boolean;
  applications: Application[];
  filteredApplications: Application[];
  statusCounts?: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handlePostcodeSelect: (postcode: string) => void;
  handleSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
}

const DashboardLayoutComponent = ({
  selectedId,
  activeFilters,
  activeSort,
  isMapView,
  setIsMapView,
  postcode,
  coordinates,
  isLoading,
  applications,
  filteredApplications,
  statusCounts,
  handleMarkerClick,
  handleFilterChange,
  handlePostcodeSelect,
  handleSortChange,
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleClose = () => {
    handleMarkerClick(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <DashboardHeader />

      <SearchSection 
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={() => setIsMapView(!isMapView)}
        applications={applications}
        statusCounts={statusCounts}
      />
      
      <div className="flex flex-1 min-h-0 relative">
        <SidebarSection 
          isMobile={isMobile}
          applications={filteredApplications}
          selectedId={selectedId}
          postcode={postcode}
          activeFilters={activeFilters}
          activeSort={activeSort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSelectApplication={handleMarkerClick}
          onClose={handleClose}
        />
        
        {(!isMobile || isMapView) && (
          <MapSection 
            isMobile={isMobile}
            isMapView={isMapView}
            coordinates={coordinates}
            applications={filteredApplications}
            selectedId={selectedId}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>

      {isLoading && <LoadingOverlay />}

      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowChatbot(!showChatbot)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50 p-4">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export const DashboardLayout = memo(DashboardLayoutComponent);
DashboardLayout.displayName = 'DashboardLayout';