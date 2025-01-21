import { Application } from "@/types/planning";

export interface StatusCounts {
  'Under Review': number;
  'Approved': number;
  'Declined': number;
  'Other': number;
}

export const calculateStatusCounts = (applications: Application[]): StatusCounts => {
  const counts: StatusCounts = {
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

  console.log('📊 Status counts:', counts);
  return counts;
};