import React from 'react';

interface MapboxErrorDisplayProps {
  error: string | null;
  debugInfo: string;
}

export const MapboxErrorDisplay: React.FC<MapboxErrorDisplayProps> = ({
  error,
  debugInfo
}) => {
  if (!error) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
        <p className="text-gray-700 mb-2">{error}</p>
        {debugInfo && (
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {debugInfo}
          </pre>
        )}
      </div>
    </div>
  );
};