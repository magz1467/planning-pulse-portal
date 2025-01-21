import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SortType } from "../use-sort-applications";

export const useDashboardURL = (
  postcode: string,
  activeFilters: { status?: string },
  selectedId: number | null,
  initialTab: string
) => {
  const navigate = useNavigate();

  const updateURLParams = (params: {
    postcode: string;
    tab: string;
    filter?: string;
    applicationId?: number | null;
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.postcode) searchParams.set("postcode", params.postcode);
      if (params.tab) searchParams.set("tab", params.tab);
      if (params.filter) searchParams.set("filter", params.filter);
      if (params.applicationId) searchParams.set("id", params.applicationId.toString());

      navigate({
        search: searchParams.toString(),
      });
    } catch (error) {
      console.error('URL update error:', error);
    }
  };

  useEffect(() => {
    updateURLParams({
      postcode,
      tab: initialTab,
      filter: activeFilters.status,
      applicationId: selectedId
    });
  }, [postcode, initialTab, activeFilters.status, selectedId]);

  return { updateURLParams };
};