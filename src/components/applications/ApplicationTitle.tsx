import { cn } from "@/lib/utils";

interface ApplicationTitleProps {
  title: string;
  className?: string;
}

const isAllCaps = (str: string) => {
  return str === str.toUpperCase() && str !== str.toLowerCase();
};

const hasEmoji = (str: string) => {
  return /[\p{Emoji}]/u.test(str);
};

const transformText = (text: string) => {
  // Don't transform text if it contains emojis
  if (hasEmoji(text)) {
    return text;
  }
  
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
  console.log('ApplicationTitle - Rendering title:', title);
  
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