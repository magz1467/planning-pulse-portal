import { cn } from "@/lib/utils";

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

export const ApplicationTitle = ({ title, className }: ApplicationTitleProps) => {
  return (
    <h2 className={cn("text-2xl font-bold mb-2 line-clamp-3", className)}>
      {title}
    </h2>
  );
};