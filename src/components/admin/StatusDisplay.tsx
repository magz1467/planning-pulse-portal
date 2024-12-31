interface StatusDisplayProps {
  totalAITitles: number | null;
}

export const StatusDisplay = ({ totalAITitles }: StatusDisplayProps) => {
  return (
    <div className="bg-muted p-4 rounded-lg mb-6">
      <h2 className="text-lg font-medium mb-2">Current Status</h2>
      <p className="text-sm text-muted-foreground">
        Total applications with AI titles: {totalAITitles !== null ? totalAITitles.toLocaleString() : 'Loading...'}
      </p>
    </div>
  );
};