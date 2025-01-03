export interface Coordinates {
  lon: number;
  lat: number;
}

export async function generateStaticMapUrl(coordinates: Coordinates, mapboxToken: string): Promise<string> {
  const width = 800;
  const height = 600;
  const zoom = 17;

  // Simple URL construction that's known to work reliably
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates.lon},${coordinates.lat},${zoom},0/${width}x${height}@2x?access_token=${mapboxToken}`;
}

export async function validateMapUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error('Error validating map URL:', error);
    return false;
  }
}