export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'declined':
      return 'bg-[#ea384c]/10 text-[#ea384c]';
    case 'under review':
      return 'bg-[#F97316]/10 text-[#F97316]';
    case 'approved':
      return 'bg-[#22c55e]/10 text-[#22c55e]';
    default:
      return 'bg-[#22c55e]/10 text-[#22c55e]';
  }
};