import { useEffect } from 'react';
import { Application } from '@/types/planning';

export const useAutoSelect = (
  isMobile: boolean,
  applications: Application[],
  selectedId: number | null,
  isLoading: boolean,
  onSelect: (id: number | null) => void
) => {
  useEffect(() => {
    if (isMobile && applications.length > 0 && !selectedId && !isLoading) {
      const timer = setTimeout(() => {
        onSelect(applications[0].id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [applications, isMobile, isLoading, onSelect, selectedId]);
};