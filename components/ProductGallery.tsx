"use client";

import { useState } from "react";
import Image from "next/image";
import { formatINR } from "@/lib/format";

export default function ProductGallery({
  images,
  alt,
  name,
  price,
}: {
  images: string[];
  alt: string;
  name?: string;
  price?: number;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-gradient-to-br from-peach to-rose">
        <div className="grid h-full place-items-center text-[10rem]">🪔</div>
      </div>
    );
  }

  const idx = Math.min(active, images.length - 1);
  const current = images[idx];
  const prev = () => setActive((a) => (a + images.length - 1) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div>
      {/* Main image - click to enlarge */}
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label="Enlarge photo"
        className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl2 border border-line bg-[#faf9f7]"
      >
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <span className="pointer-events-none absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-ink/65 text-cream opacity-0 transition group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={"View photo " + (i + 1)}
              className={
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#faf9f7] transition " +
                (i === idx ? "border-terracotta" : "border-line hover:border-ink-soft")
              }
            >
              <Image src={src} alt={alt + " " + (i + 1)} fill className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      {/* Full-screen lightbox */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
        >
          <button
            onClick={() => setZoom(false)}
            aria-label="Close"
            className="absolute right-5 top-4 text-3xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
                className="absolute left-3 text-4xl text-white/70 hover:text-white"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
                className="absolute right-3 text-4xl text-white/70 hover:text-white"
              >
                ›
              </button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
            <div className="relative h-[80vh] w-[92vw] max-w-3xl">
              <Image src={current} alt={alt} fill sizes="92vw" className="object-contain" />
            </div>
            {(name || price !== undefined) && (
              <figcaption className="mt-3 text-center text-white">
                {name ? <span className="font-display text-lg">{name}</span> : null}
                {price !== undefined ? <span className="ml-3 text-sm text-white/90">{formatINR(price)}</span> : null}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
