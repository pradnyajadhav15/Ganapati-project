"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-gradient-to-br from-peach to-rose">
        <div className="grid h-full place-items-center text-[10rem]">🪔</div>
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-gradient-to-br from-peach to-rose">
        <Image src={current} alt={alt} fill className="object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={"View photo " + (i + 1)}
              className={
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition " +
                (i === active ? "border-terracotta" : "border-line hover:border-ink-soft")
              }
            >
              <Image src={src} alt={alt + " " + (i + 1)} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}