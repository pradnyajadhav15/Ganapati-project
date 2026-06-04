"use client";

import { useState } from "react";

type Img = { id: string; image_url: string; caption: string | null };

export default function GalleryGrid({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);
  const prev = () => setOpen((o) => (o === null ? o : (o + images.length - 1) % images.length));
  const next = () => setOpen((o) => (o === null ? o : (o + 1) % images.length));

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpen(i)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.image_url}
              alt={img.caption || "R. Ramesh Arts work"}
              loading="lazy"
              className="w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
            {img.caption ? (
              <div className="px-3 py-2 text-center text-xs text-ink-soft">{img.caption}</div>
            ) : null}
          </button>
        ))}
      </div>

      {open !== null && images[open] && (
        <div onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button onClick={close} className="absolute right-5 top-4 text-3xl leading-none text-white/80 hover:text-white" aria-label="Close">×</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 text-4xl text-white/70 hover:text-white" aria-label="Previous">‹</button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 text-4xl text-white/70 hover:text-white" aria-label="Next">›</button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()} className="max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[open].image_url} alt={images[open].caption || ""} className="max-h-[80vh] w-auto rounded-lg object-contain" />
            {images[open].caption ? (
              <figcaption className="mt-3 text-center text-sm text-white/90">{images[open].caption}</figcaption>
            ) : null}
          </figure>
        </div>
      )}
    </>
  );
}
