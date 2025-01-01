import React from 'react';

interface MapboxErrorDisplayProps {
  error: string | null;
  debugInfo: string;
}

export const MapboxErrorDisplay: React.FC<MapboxErrorDisplayProps> = ({ error, debugInfo }) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-10">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
        <h3 className="text-red-500 font-semibold mb-2">Map Error</h3>
        <p className="text-gray-600 mb-2">{error}</p>
        <details className="text-xs text-gray-500">
          <summary>Debug Information</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
            {debugInfo}
          </pre>
        </details>
      </div>
    </div>
  );
};