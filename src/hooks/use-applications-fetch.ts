import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";

export const PAGE_SIZE = 100;

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchApplicationsInRadius = async (
    center_lat: number,
    center_lng: number,
    radius_meters: number = 1000
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-applications-with-counts', {
        body: {
          center_lat,
          center_lng,
          radius_meters,
          page_size: PAGE_SIZE,
          page_number: currentPage
        }
      });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      if (data) {
        setApplications(data.applications || []);
        setTotalCount(data.total || 0);
        return data;
      }
    } catch (error) {
      console.error('Error in fetchApplicationsInRadius:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
    fetchApplicationsInRadius,
    PAGE_SIZE
  };
};