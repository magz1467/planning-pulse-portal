import { SearchX } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-4rem)]">
      <SearchX className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-500 mb-2 font-medium">No planning applications found</p>
      <p className="text-sm text-gray-400">Try adjusting your search criteria or zooming out</p>
    </div>
  );
};