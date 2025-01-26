export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-gray-500 mb-2">No planning applications found</p>
      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
    </div>
  );
};