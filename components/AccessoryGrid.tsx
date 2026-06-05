"use client";

import { useState } from "react";
import Image from "next/image";
import { formatINR } from "@/lib/format";

type Item = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
};

export default function AccessoryGrid({ accessories }: { accessories: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);
  const prev = () => setOpen((o) => (o === null ? o : (o + accessories.length - 1) % accessories.length));
  const next = () => setOpen((o) => (o === null ? o : (o + 1) % accessories.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {accessories.map((a, i) => (
          <div key={a.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <button
              type="button"
              onClick={() => a.image_url && setOpen(i)}
              aria-label={"Enlarge " + a.name}
              className="relative flex aspect-square w-full cursor-zoom-in items-center justify-center bg-[#faf9f7] p-6"
            >
              {a.image_url ? (
                <Image src={a.image_url} alt={a.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
              ) : null}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </button>
            <div className="mx-5 h-px bg-line" />
            <div className="flex flex-col items-center gap-1 px-5 py-4">
              <span className="font-display text-[1.15rem] tracking-wide text-ink">{a.name}</span>
              {a.subtitle ? (
                <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/40">{a.subtitle}</span>
              ) : null}
              <span className="mt-2 font-display text-[1.1rem] text-terracotta">{formatINR(a.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {open !== null && accessories[open] && accessories[open].image_url && (
        <div onClick={close} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4">
          <button onClick={close} aria-label="Close" className="absolute right-5 top-4 text-3xl leading-none text-white/80 hover:text-white">×</button>
          {accessories.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-3 text-4xl text-white/70 hover:text-white">‹</button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-3 text-4xl text-white/70 hover:text-white">›</button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
            <div className="relative h-[78vh] w-[92vw] max-w-3xl">
              <Image src={accessories[open].image_url as string} alt={accessories[open].name} fill sizes="92vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 text-center text-white">
              <span className="font-display text-lg">{accessories[open].name}</span>
              {accessories[open].subtitle ? <span className="ml-2 text-sm text-white/70">{accessories[open].subtitle}</span> : null}
              <span className="ml-3 text-sm text-white/90">{formatINR(accessories[open].price)}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
