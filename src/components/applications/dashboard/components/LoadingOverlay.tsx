import { Home } from "lucide-react";

export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4 relative overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-white to-white opacity-50" />
        
        <div className="relative flex flex-col items-center gap-6">
          {/* Animated icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <Home className="w-16 h-16 text-primary animate-pulse" />
          </div>

          {/* Loading message */}
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Loading Planning Data
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              We're gathering the latest planning applications in your area
            </p>

            {/* Trust indicators */}
            <ul className="space-y-2 text-sm text-gray-600 mt-6">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Official planning data</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Real-time updates</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Verified local information</span>
              </li>
            </ul>
          </div>

          {/* Loading spinner */}
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mt-2" />
        </div>
      </div>
    </div>
  );
};