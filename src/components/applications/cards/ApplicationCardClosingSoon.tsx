import { Timer } from "lucide-react";

interface ApplicationCardClosingSoonProps {
  isClosingSoon: boolean;
}

export const ApplicationCardClosingSoon = ({ isClosingSoon }: ApplicationCardClosingSoonProps) => {
  if (!isClosingSoon) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
      <Timer className="w-3 h-3" />
      Closing soon
    </span>
  );
};