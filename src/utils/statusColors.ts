export const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase() || '';

  if (statusLower.includes('under consideration') || statusLower.includes('pending')) {
    return 'bg-orange-100 text-orange-800'; // Restored to orange
  } else if (statusLower.includes('approved') || statusLower.includes('granted') || statusLower.includes('no objection')) {
    return 'bg-green-100 text-green-800';
  } else if (statusLower.includes('refused') || statusLower.includes('rejected') || statusLower.includes('withdrawn')) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status: string) => {
  const statusLower = status?.toLowerCase() || '';

  if (statusLower.includes('application under consideration')) {
    return 'Under Consideration';
  } else if (statusLower.includes('no objection to proposal (obs only)')) {
    return 'No Objection to Proposal';
  }
  return status;
};