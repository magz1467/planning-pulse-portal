import { Application } from "@/types/planning";

export const generateMockApplication = (id: number): Application => {
  const statuses = ['Under Review', 'Approved', 'Declined', 'Pending'];
  const types = ['Full Planning Permission', 'Listed Building Consent', 'Change of Use'];
  const wards = ['North Ward', 'South Ward', 'East Ward', 'West Ward'];

  return {
    id,
    title: `Planning Application ${id}`,
    address: `${Math.floor(Math.random() * 100)} Example Street, City`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    distance: `${(Math.random() * 5).toFixed(1)} mi`,
    reference: `REF${String(id).padStart(6, '0')}`,
    description: `Description for planning application ${id}`,
    applicant: `Applicant ${id}`,
    submissionDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    decisionDue: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    ward: wards[Math.floor(Math.random() * wards.length)],
    officer: `Officer ${id}`,
    consultationEnd: new Date(Date.now() + Math.random() * 5000000000).toISOString(),
    image: '/placeholder.svg',
    coordinates: [51.5074 + (Math.random() - 0.5) * 0.1, -0.1278 + (Math.random() - 0.5) * 0.1],
    postcode: 'SW1A 1AA',
    ai_title: `AI Generated Title ${id}`,
    last_date_consultation_comments: new Date(Date.now() + Math.random() * 5000000000).toISOString(),
    valid_date: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  };
};
