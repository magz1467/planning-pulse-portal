import { cn } from "@/lib/utils";

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

export const ApplicationTitle = ({ title, className }: ApplicationTitleProps) => {
  return (
    <div className={cn("font-semibold text-primary", className)}>
      {title}
    </div>
  );
};