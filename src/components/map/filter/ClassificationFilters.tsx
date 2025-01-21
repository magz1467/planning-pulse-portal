import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Film, Tree, Hammer, Home, House, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassificationFiltersProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilter?: string;
}

export const ClassificationFilters = ({
  onFilterChange,
  activeFilter,
}: ClassificationFiltersProps) => {
  const filters = [
    {
      label: "High Impact",
      value: "high_impact",
      icon: Award,
      description: "Impact scores above 70",
    },
    {
      label: "Entertainment",
      value: "entertainment",
      icon: Film,
      description: "Entertainment venues",
    },
    {
      label: "Trees",
      value: "trees",
      icon: Tree,
      description: "Tree-related applications",
    },
    {
      label: "Demolition",
      value: "demolition",
      icon: Hammer,
      description: "Demolition works",
    },
    {
      label: "Housing",
      value: "housing",
      icon: House,
      description: "New build houses",
    },
    {
      label: "Extensions",
      value: "home_extension",
      icon: Home,
      description: "Home extensions",
    },
    {
      label: "Landscaping",
      value: "landscaping",
      icon: Trees,
      description: "Landscaping works",
    },
    {
      label: "Other",
      value: "other",
      icon: House,
      description: "Other applications",
    }
  ];

  return (
    <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.value;
        
        return (
          <Button
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "flex flex-col items-center gap-1 py-2 h-auto min-w-[80px] whitespace-nowrap",
              isActive && "bg-primary text-primary-foreground",
              !isActive && "hover:bg-primary/5"
            )}
            onClick={() => onFilterChange("classification", isActive ? "" : filter.value)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{filter.label}</span>
          </Button>
        );
      })}
    </div>
  );
});