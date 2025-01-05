import { LatLngTuple } from 'leaflet';

export const logFetchParams = (
  center: [number, number],
  radiusInMeters: number,
  pageSize?: number,
  pageNumber?: number
) => {
  console.log('Fetching applications with params:', {
    center_lat: center[0],
    center_lng: center[1],
    radius_meters: radiusInMeters,
    ...(pageSize && { page_size: pageSize }),
    ...(pageNumber && { page_number: pageNumber })
  });
};

export const logFetchError = (error: any, params: any) => {
  console.error('Error fetching applications:', {
    error,
    message: error.message,
    params
  });
};

export const logFetchSuccess = (data: any) => {
  console.log('Successfully fetched applications:', {
    count: data?.length,
    firstApp: data?.[0],
    lastApp: data?.[data?.length - 1]
  });
};