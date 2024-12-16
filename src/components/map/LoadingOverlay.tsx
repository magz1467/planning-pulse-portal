import { Check, Loader2 } from "lucide-react";

export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold text-center">
            Finding planning applications
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-1">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-gray-600">Up to date data</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-1">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-gray-600">Easy to feedback</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-1">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-gray-600">Feedback shared with decision makers</span>
          </div>
        </div>
      </div>
    </div>
  );
};