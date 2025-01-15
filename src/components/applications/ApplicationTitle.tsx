import { cn } from "@/lib/utils";
import { memo } from 'react';

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

const transformText = (text: string) => {
  return text; // Assuming this function transforms the text in some way
};

const ApplicationTitleComponent = ({ title, className }: ApplicationTitleProps) => {
  return (
    <h3 
      className={cn(
        "text-sm font-medium leading-none",
        className
      )}
    >
      {transformText(title)}
    </h3>
  );
};

export const ApplicationTitle = memo(ApplicationTitleComponent);
ApplicationTitle.displayName = 'ApplicationTitle';
