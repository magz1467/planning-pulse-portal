export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-4">
            <p className="text-xl font-medium text-gray-900 text-center mb-4">Loading...</p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Verified planning application data from local authorities</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Real-time updates and accurate location mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Organized and filtered for easy navigation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};