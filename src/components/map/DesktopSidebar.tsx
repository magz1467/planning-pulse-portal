import { Application } from "@/types/planning";
import { PlanningApplicationList } from "@/components/PlanningApplicationList";
import { PlanningApplicationDetails } from "@/components/PlanningApplicationDetails";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface DesktopSidebarProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  onSelectApplication: (id: number) => void;
  onClose: () => void;
}

export const DesktopSidebar = ({
  applications,
  selectedApplication,
  postcode,
  activeFilters,
  activeSort,
  onFilterChange,
  onSortChange,
  onSelectApplication,
  onClose,
}: DesktopSidebarProps) => {
  const selectedApplicationData = selectedApplication
    ? applications.find((app) => app.id === selectedApplication)
    : null;

  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleAreaUpdatesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !postcode) return;

    try {
      const { error } = await supabase
        .from('User data')
        .insert([
          {
            Email: email,
            "Post Code": postcode,
            Marketing: true,
            Type: 'resident'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been subscribed to updates for this area.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe to updates. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full md:w-[400px] h-full overflow-y-auto border-r border-gray-200 bg-white">
      <FilterBar 
        onFilterChange={onFilterChange} 
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
      {selectedApplication === null ? (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed about new planning applications in {postcode}
              </p>
              <form onSubmit={handleAreaUpdatesSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Subscribe to Updates
                </Button>
              </form>
            </div>
          </div>
          <div className="flex-grow">
            <PlanningApplicationList
              applications={applications}
              postcode={postcode}
              onSelectApplication={onSelectApplication}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between border-b py-2 px-4">
            <h2 className="font-semibold">Planning Application Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <PlanningApplicationDetails
            application={selectedApplicationData!}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
};