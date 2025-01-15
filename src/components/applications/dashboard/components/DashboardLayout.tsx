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
import { useState } from "react";

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
  coordinates: [number, number] | null;
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

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
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
}) => {
  const isMobile = useIsMobile();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleClose = () => {
    handleMarkerClick(null);
  };

  const handleCenterChange = (newCenter: [number, number]) => {
    if (handlePostcodeSelect) {
      handlePostcodeSelect(`${newCenter[0]},${newCenter[1]}`);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative">
      <DashboardHeader />

      <SearchSection 
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={coordinates ? handleFilterChange : undefined}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={isMobile ? () => {
          setIsMapView(!isMapView);
          if (isMapView) {
            handleMarkerClick(null);
          }
        } : undefined}
        applications={applications}
        statusCounts={statusCounts}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex" style={{ zIndex: 10 }}>
          <SidebarSection
            isMobile={isMobile}
            isMapView={isMapView}
            applications={filteredApplications}
            selectedId={selectedId}
            postcode={postcode}
            coordinates={coordinates as [number, number]}
            activeFilters={activeFilters}
            activeSort={activeSort}
            statusCounts={statusCounts}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSelectApplication={handleMarkerClick}
            onClose={handleClose}
          />

          {(!isMobile || isMapView) && (
            <MapSection
              applications={filteredApplications}
              selectedId={selectedId}
              coordinates={coordinates as [number, number]}
              isMobile={isMobile}
              isMapView={isMapView}
              onMarkerClick={handleMarkerClick}
              onCenterChange={handleCenterChange}
            />
          )}
        </div>
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