import L from "leaflet";

const createIcon = (iconName: string, size: number = 32, color: string = "#2563eb") => {
  return L.divIcon({
    className: 'bg-transparent',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="${color}" fill="white" stroke-width="2"/>
      <circle cx="12" cy="10" r="3" stroke="${color}" fill="white" stroke-width="2"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });
};

export const searchIcon = createIcon('map-pin', 24);
export const applicationIcon = createIcon('map-pin', 32);
export const selectedApplicationIcon = createIcon('map-pin', 48, '#dc2626');