import { Application } from "@/types/planning";
import { getImageUrl } from "@/utils/imageUtils";
import Image from "@/components/ui/image";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [staticMapUrl, setStaticMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaticMap = async () => {
      if (!application?.coordinates) return;

      try {
        // First check if we already have a static map image
        const { data: existingImage, error } = await supabase
          .from('application_map_images')
          .select('image_url')
          .eq('application_id', application.id)
          .maybeSingle()

        if (existingImage) {
          setStaticMapUrl(existingImage.image_url);
          return;
        }

        // If not, generate a new one
        const { data, error: fnError } = await supabase.functions.invoke('generate-static-map', {
          body: { applications: [application] }
        });

        if (fnError) throw fnError;
        if (data?.images?.[0]) {
          setStaticMapUrl(data.images[0].image_url);
        }
      } catch (error) {
        console.error('Error fetching static map:', error);
      }
    };

    fetchStaticMap();
  }, [application]);

  return (
    <div className="aspect-video relative overflow-hidden rounded-lg">
      <Image
        src={staticMapUrl || "/placeholder.svg"}
        alt={application?.title || ''}
        className="object-cover w-full h-full"
      />
    </div>
  );
};