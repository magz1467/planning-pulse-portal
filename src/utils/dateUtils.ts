export const isWithinNextSevenDays = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  const now = new Date();
  
  // Set both dates to start of day for accurate comparison
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return true if date is in the future and within next 7 days
  return diffDays > 0 && diffDays <= 7;
};