import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ImageLoaderType } from "@/types/utils";

const ImageLoader = ({ src, alt, className }: ImageLoaderType) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full">
      {!loaded && (
        <div className="absolute inset-0 h-full animate-pulse rounded-md bg-gray" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(className, {
          "opacity-0": !loaded,
          "h-full opacity-100 transition-opacity duration-300": loaded,
        })}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageLoader;
