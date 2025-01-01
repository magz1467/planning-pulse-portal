import { useMemo } from 'react';
import { Application } from '@/types/planning';
import { isWithinNextSevenDays } from '@/utils/dateUtils';

export type SortType = 'closingSoon' | 'newest' | null;

export const useSortApplications = (
  applications: Application[],
  sortType: SortType
) => {
  return useMemo(() => {
    if (!sortType || !applications?.length) return applications;

    const sortedApps = [...applications];

    if (sortType === 'newest') {
      return sortedApps.sort((a, b) => {
        // Convert valid_date strings to timestamps for comparison
        const dateA = a.valid_date ? new Date(a.valid_date).getTime() : 0;
        const dateB = b.valid_date ? new Date(b.valid_date).getTime() : 0;
        return dateB - dateA; // Most recent first
      });
    }

    if (sortType === 'closingSoon') {
      return sortedApps.sort((a, b) => {
        // First check if items are closing soon
        const aClosingSoon = a.last_date_consultation_comments ? 
          isWithinNextSevenDays(a.last_date_consultation_comments) : false;
        const bClosingSoon = b.last_date_consultation_comments ? 
          isWithinNextSevenDays(b.last_date_consultation_comments) : false;

        // If both or neither are closing soon, sort by actual date
        if (aClosingSoon === bClosingSoon) {
          const dateA = a.last_date_consultation_comments ? 
            new Date(a.last_date_consultation_comments).getTime() : Infinity;
          const dateB = b.last_date_consultation_comments ? 
            new Date(b.last_date_consultation_comments).getTime() : Infinity;
          return dateA - dateB; // Soonest first
        }

        // Put closing soon items first
        return aClosingSoon ? -1 : 1;
      });
    }

    return applications;
  }, [applications, sortType]);
};