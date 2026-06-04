"use client";

import { useState } from "react";
import Link from "next/link";

type LinkItem = { href: string; label: string };

export default function MobileMenu({
  home,
  ourCollections,
  collections,
  links,
}: {
  home: string;
  ourCollections: string;
  collections: LinkItem[];
  links: LinkItem[];
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-cream-deep"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-[78px] z-40 bg-black/20" onClick={close} />
          <div className="fixed inset-x-0 top-[78px] z-50 border-b border-line bg-cream p-5 shadow-soft">
            <div className="flex flex-col gap-1">
              <Link href="/" onClick={close} className="rounded-lg px-3 py-3 text-ink-soft hover:bg-cream-deep hover:text-ink">
                {home}
              </Link>

              <div className="mt-1 px-3 pt-2 text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft/60">
                {ourCollections}
              </div>
              {collections.map((c) => (
                <Link key={c.href} href={c.href} onClick={close} className="rounded-lg px-3 py-2.5 text-ink-soft hover:bg-cream-deep hover:text-ink">
                  {c.label}
                </Link>
              ))}

              <div className="my-1 h-px bg-line" />
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={close} className="rounded-lg px-3 py-3 text-ink-soft hover:bg-cream-deep hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}