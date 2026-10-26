"use client";

import { useEffect, useRef, useState } from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  initials?: string;
  className?: string;
}

/** Profile photo with an initials fallback when the image is missing or fails to load. */
export default function Avatar({ src, alt, initials = "HP", className }: AvatarProps) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className={`avatar-fb ${className ?? ""}`.trim()} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        {initials}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
