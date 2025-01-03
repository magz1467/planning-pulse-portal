import Image from "@/components/ui/image";

interface ApplicationCardImageProps {
  imageUrl: string;
  alt: string;
}

export const ApplicationCardImage = ({ imageUrl, alt }: ApplicationCardImageProps) => {
  // Ensure we have a valid image URL or fallback
  const finalImageUrl = imageUrl && imageUrl !== 'null' && imageUrl !== 'undefined'
    ? imageUrl
    : "/placeholder.svg";

  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
      <Image
        src={finalImageUrl}
        alt={alt || 'Planning application image'}
        width={80}
        height={80}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};