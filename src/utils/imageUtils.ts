export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";

export const getImageUrl = (path: string | undefined): string => {
  if (!path || path.trim() === '' || path === 'undefined' || path === 'null') {
    return FALLBACK_IMAGE;
  }
  if (!path.startsWith('/') && !path.startsWith('http')) {
    return FALLBACK_IMAGE;
  }
  return path;
};