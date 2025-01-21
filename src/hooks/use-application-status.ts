import { useState } from 'react';

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

  const calculateStatusCounts = (applications: any[]) => {
    const counts = {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    };

    applications.forEach(app => {
      const status = app.status.toLowerCase();
      if (status.includes('under consideration')) {
        counts['Under Review']++;
      } else if (status.includes('approved')) {
        counts['Approved']++;
      } else if (status.includes('declined')) {
        counts['Declined']++;
      } else {
        counts['Other']++;
      }
    });

    setStatusCounts(counts);
    console.log('📊 Status counts:', counts);
  };

  return {
    statusCounts,
    calculateStatusCounts
  };
};