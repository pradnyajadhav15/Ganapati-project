"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";

const FULL: Record<string, string> = { en: "English", hi: "हिंदी", mr: "मराठी" };

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Change language" className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-ink-soft transition hover:bg-cream-deep">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="opacity-80"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" /></svg>
        <span>{LOCALE_LABELS[current]}</span>
        <span className="text-[0.7rem] leading-none">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[130px] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-soft">
          {LOCALES.map((l) => (
            <button key={l} onClick={() => choose(l)} className={"block w-full px-3 py-2 text-left text-sm transition " + (current === l ? "bg-cream-deep font-semibold text-ink" : "text-ink-soft hover:bg-cream-deep")}>{FULL[l] ?? LOCALE_LABELS[l]}</button>
          ))}
        </div>
      )}
    </div>
  );
}
