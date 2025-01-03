export const FALLBACK_IMAGE = "/placeholder.svg";

export const getImageUrl = (path: string | undefined): string => {
  if (!path || path.trim() === '' || path === 'undefined' || path === 'null') {
    return FALLBACK_IMAGE;
  }

  // Handle absolute URLs
  if (path.startsWith('http')) {
    return path;
  }

  // Handle relative paths from public directory
  if (path.startsWith('/')) {
    return path;
  }

  // If none of the above, return fallback
  return FALLBACK_IMAGE;
};