interface ApplicationMetaProps {
  status: string;
  distance: string;
}

export const ApplicationMeta = ({ status, distance }: ApplicationMetaProps) => {
  return (
    <div className="flex justify-between items-center mt-1">
      <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
        {status}
      </span>
      <span className="text-xs text-gray-500">{distance}</span>
    </div>
  );
};