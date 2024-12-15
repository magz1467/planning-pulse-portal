import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  activeFilters: {
    status?: string;
    type?: string;
  };
}

export const FilterBar = ({ onFilterChange, activeFilters }: FilterBarProps) => {
  const statusOptions = ["Under Review", "Approved", "Declined"];
  const typeOptions = [
    "New Build Residential",
    "New Build Commercial",
    "Extension Residential",
    "Extension Commercial",
  ];

  return (
    <div className="flex gap-4 p-4 bg-white border-b border-gray-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-between">
            <span>{activeFilters.status || "Status"}</span>
            <Filter className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusOptions.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => onFilterChange("status", status)}
              className="cursor-pointer"
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-between">
            <span>{activeFilters.type || "Type"}</span>
            <Filter className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {typeOptions.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => onFilterChange("type", type)}
              className="cursor-pointer"
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};