export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'declined':
    case 'refused':
    case 'withdrawn':
    case 'dismissed':
      return 'bg-[#ea384c]/10 text-[#ea384c]';
    case 'under review':
    case 'pending':
    case 'under consideration':
    case 'application under consideration':
    case 'appeal in progress':
    case 'application received':
      return 'bg-[#FEC6A1]/30 text-[#F97316]';
    case 'approved':
      return 'bg-[#F2FCE2] text-[#16a34a]';
    default:
      return 'bg-[#F2FCE2] text-[#16a34a]';
  }
};

export const getStatusText = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'under consideration':
    case 'application under consideration':
      return 'Under Consideration';
    default:
      return status;
  }
};