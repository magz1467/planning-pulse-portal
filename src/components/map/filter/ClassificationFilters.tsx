import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Film, Trees, Hammer, Home, House } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassificationFiltersProps {
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilter?: string;
}

export const ClassificationFilters = ({
  onFilterChange,
  activeFilter,
}: ClassificationFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    activeFilter || null
  );

  const filters = [
    { id: "high-impact", label: "High Impact", icon: Award },
    { id: "entertainment", label: "Entertainment", icon: Film },
    { id: "trees", label: "Trees", icon: Trees },
    { id: "demolition", label: "Demolition", icon: Hammer },
    { id: "housing", label: "Housing", icon: House },
    { id: "extensions", label: "Extensions", icon: Home },
  ];

  const handleFilterClick = (filterId: string) => {
    const newFilter = selectedFilter === filterId ? null : filterId;
    setSelectedFilter(newFilter);
    if (onFilterChange) {
      onFilterChange("classification", newFilter || "");
    }
  };

  return (
    <div className="flex gap-2 w-full">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 whitespace-nowrap transition-colors flex-1",
              selectedFilter === filter.id
                ? "bg-primary text-white hover:bg-primary/90"
                : "hover:bg-gray-100"
            )}
            onClick={() => handleFilterClick(filter.id)}
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};