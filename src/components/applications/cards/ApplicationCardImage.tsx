import Image from "@/components/ui/image";

interface ApplicationCardImageProps {
  imageUrl: string;
  alt: string;
}

export const ApplicationCardImage = ({ imageUrl, alt }: ApplicationCardImageProps) => {
  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
      <Image
        src={imageUrl}
        alt={alt}
        width={80}
        height={80}
        className="w-full h-full object-cover"
      />
    </div>
  );
};