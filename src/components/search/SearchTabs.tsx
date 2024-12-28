import { Button } from "@/components/ui/button";

interface SearchTabsProps {
  activeTab: 'recent' | 'completed';
  onTabChange: (tab: 'recent' | 'completed') => void;
  disabled?: boolean;
}

export const SearchTabs = ({ activeTab, onTabChange, disabled }: SearchTabsProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button 
        variant="outline" 
        className={`flex-1 transition-colors ${
          activeTab === 'recent' 
            ? 'bg-primary-light text-primary hover:bg-primary hover:text-white' 
            : 'hover:bg-primary-light hover:text-primary'
        }`}
        onClick={() => onTabChange('recent')}
        disabled={disabled}
      >
        Recent
      </Button>
      <Button 
        variant="outline" 
        className={`flex-1 transition-colors ${
          activeTab === 'completed' 
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
            : 'hover:bg-gray-100 hover:text-gray-600'
        }`}
        onClick={() => onTabChange('completed')}
        disabled={disabled}
      >
        Completed
      </Button>
    </div>
  );
};