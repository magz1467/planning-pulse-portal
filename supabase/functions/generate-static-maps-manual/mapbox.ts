export interface Coordinates {
  lon: number;
  lat: number;
}

export async function generateStaticMapUrl(coordinates: Coordinates, mapboxToken: string): Promise<string> {
  // Validate coordinates
  if (!coordinates || typeof coordinates.lon !== 'number' || typeof coordinates.lat !== 'number') {
    throw new Error(`Invalid coordinates: ${JSON.stringify(coordinates)}`);
  }

  const width = 800;
  const height = 600;
  const zoom = 22; // Maximum zoom level in Mapbox

  // Log the coordinates being used
  console.log('Generating map URL with coordinates:', coordinates);

  // Simple URL construction that's known to work reliably
  const url = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates.lon},${coordinates.lat},${zoom},0/${width}x${height}@2x?access_token=${mapboxToken}`;
  
  console.log('Generated map URL:', url);
  return url;
}

export async function validateMapUrl(url: string): Promise<boolean> {
  try {
    console.log('Validating map URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Map URL validation failed:', {
        status: response.status,
        statusText: response.statusText
      });
      return false;
    }
    
    console.log('Map URL validation successful');
    return true;
  } catch (error) {
    console.error('Error validating map URL:', error);
    return false;
  }
}