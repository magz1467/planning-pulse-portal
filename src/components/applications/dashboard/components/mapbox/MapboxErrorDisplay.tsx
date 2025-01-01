interface MapboxErrorDisplayProps {
  error: string | null;
  debugInfo: string;
}

export const MapboxErrorDisplay = ({ error, debugInfo }: MapboxErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 bg-red-50 p-4 overflow-auto">
      <h3 className="text-red-800 font-bold">Map Error</h3>
      <p className="text-red-600">{error}</p>
      {debugInfo && (
        <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
          {debugInfo}
        </pre>
      )}
    </div>
  );
};