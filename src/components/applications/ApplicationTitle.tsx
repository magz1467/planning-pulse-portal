import { cn } from "@/lib/utils";

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

export const ApplicationTitle = ({ title, className }: ApplicationTitleProps) => {
  return (
    <h3 
      className={cn(
        "font-semibold text-primary line-clamp-2 text-sm leading-tight",
        className
      )}
    >
      {title}
    </h3>
  );
};