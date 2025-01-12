import { cn } from "@/lib/utils";

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

const isAllCaps = (str: string) => {
  return str === str.toUpperCase() && str !== str.toLowerCase();
};

const transformText = (text: string) => {
  if (!isAllCaps(text)) return text;
  
  // Split into words and transform each
  return text.split(' ').map(word => {
    // Skip short words that might be acronyms (like UK, US, etc)
    if (word.length <= 3) return word;
    
    // Transform the word to title case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

export const ApplicationTitle = ({ title, className }: ApplicationTitleProps) => {
  return (
    <h3 
      className={cn(
        "font-semibold text-primary line-clamp-2 text-sm leading-tight",
        className
      )}
    >
      {transformText(title)}
    </h3>
  );
};