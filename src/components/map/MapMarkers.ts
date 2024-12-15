import L from "leaflet";

const createIcon = (size: number, className?: string) =>
  L.divIcon({
    className: `bg-transparent ${className || ""}`,
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor" class="text-primary"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });

export const searchIcon = createIcon(24);
export const applicationIcon = createIcon(32);
export const selectedApplicationIcon = createIcon(48, "animate-pulse");