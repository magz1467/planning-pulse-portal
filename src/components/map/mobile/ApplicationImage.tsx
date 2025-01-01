import Image from "@/components/ui/Image";

interface ApplicationImageProps {
  src: string;
  alt: string;
}

export const ApplicationImage = ({ src, alt }: ApplicationImageProps) => {
  return (
    <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
      <Image
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        loading="lazy"
      />
    </div>
  );
};