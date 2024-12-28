import { Application } from "./planning";

export interface MapState {
  selectedApplication: number | null;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
}

export interface MapActions {
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handleSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
}
