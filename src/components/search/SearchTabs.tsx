import { Button } from "@/components/ui/button";

interface SearchTabsProps {
  activeTab: 'recent' | 'completed';
  onTabChange: (tab: 'recent' | 'completed') => void;
  disabled?: boolean;
}

export const SearchTabs = ({ activeTab, onTabChange, disabled }: SearchTabsProps) => {
  return (
    <div className="flex mb-6">
      <Button 
        variant="outline" 
        className={`flex-1 transition-colors border-2 ${
          activeTab === 'recent' 
            ? 'bg-accent text-primary hover:bg-accent/90' 
            : 'hover:bg-accent/20'
        }`}
        onClick={() => onTabChange('recent')}
        disabled={disabled}
      >
        Recent
      </Button>
    </div>
  );
};