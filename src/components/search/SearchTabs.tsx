import { Button } from "@/components/ui/button";

interface SearchTabsProps {
  activeTab: 'recent' | 'completed';
  onTabChange: (tab: 'recent' | 'completed') => void;
  disabled?: boolean;
}

export const SearchTabs = ({ activeTab, onTabChange, disabled }: SearchTabsProps) => {
  return (
    <div className="flex mb-6">
    </div>
  );
};