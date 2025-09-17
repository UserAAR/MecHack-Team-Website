"use client";

import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  aspectClassName?: string;
  controlsOnHover?: boolean;
};

export function ImageCarousel({ images, alt, aspectClassName, controlsOnHover = false }: Props) {
  const items = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [index, setIndex] = useState(0);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  if (items.length === 0) return null;

  const controlsClass = controlsOnHover
    ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
    : "";

  return (
    <div className="group relative rounded-xl overflow-hidden ring-1 ring-black/5 bg-black">
      <div className={`relative w-full ${aspectClassName ?? "h-64 md:h-80"}`}>
        <Image src={items[index]} alt={alt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.25),rgba(0,0,0,0))]" />
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow ${controlsClass}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow ${controlsClass}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
} 