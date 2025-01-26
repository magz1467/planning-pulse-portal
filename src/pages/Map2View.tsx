import { useState } from 'react';
import { Map2Container } from '@/components/map2/Map2Container';
import { PostcodeSearch } from '@/components/PostcodeSearch';
import { useCoordinates } from '@/hooks/use-coordinates';

const Map2View = () => {
  const [postcode, setPostcode] = useState<string>('');
  const { coordinates, isLoading } = useCoordinates(postcode);

  const handleSearch = async (newPostcode: string) => {
    setPostcode(newPostcode);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white p-4 shadow-md">
        <PostcodeSearch 
          onSelect={handleSearch}
          placeholder="Search location..."
          className="max-w-xl mx-auto"
        />
      </div>
      <div className="flex-1 relative">
        <Map2Container 
          coordinates={coordinates ? [coordinates[1], coordinates[0]] : undefined}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Map2View;