import { FC } from 'react';
import Image from "@/components/ui/image";

export const PetitionImage: FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Image
        src="/lovable-uploads/44747e06-e179-40ce-9a85-66748ee50961.png"
        alt="Create a petition illustration"
        width={400}
        height={400}
        className="rounded-full shadow-md max-w-full h-auto"
      />
    </div>
  );
};