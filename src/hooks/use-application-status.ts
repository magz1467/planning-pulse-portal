import { useState } from 'react';
import { Application } from "@/types/planning";

interface StatusCounts {
  'Under Review': number;
  'Approved': number;
  'Declined': number;
  'Other': number;
}

export const useApplicationStatus = () => {
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  });

  const calculateStatusCounts = (applications: Application[]) => {
    const counts = applications.reduce((acc, app) => {
      const status = app.status?.toLowerCase() || '';
      if (status.includes('under consideration')) {
        acc['Under Review']++;
      } else if (status.includes('approved')) {
        acc['Approved']++;
      } else if (status.includes('declined') || status.includes('refused') || status.includes('withdrawn')) {
        acc['Declined']++;
      } else {
        acc['Other']++;
      }
      return acc;
    }, {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    });

    setStatusCounts(counts);
  };

  return {
    statusCounts,
    calculateStatusCounts
  };
};