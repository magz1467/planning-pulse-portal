interface ApplicationCardDistanceProps {
  distance: string;
}

export const ApplicationCardDistance = ({ distance }: ApplicationCardDistanceProps) => {
  return <span className="text-xs text-gray-500">{distance}</span>;
};