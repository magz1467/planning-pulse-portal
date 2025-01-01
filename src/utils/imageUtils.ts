export const FALLBACK_IMAGE = "/placeholder.svg";

export const getImageUrl = (path: string | undefined): string => {
  if (!path || path.trim() === '' || path === 'undefined' || path === 'null') {
    return FALLBACK_IMAGE;
  }
  if (!path.startsWith('/') && !path.startsWith('http')) {
    return FALLBACK_IMAGE;
  }
  return path;
};