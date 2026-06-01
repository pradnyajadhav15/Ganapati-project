"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function choose(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => choose(l)}
          className={`rounded-md px-2 py-1 transition ${
            current === l
              ? "bg-sage-deep text-white"
              : "text-ink-soft hover:bg-cream-deep"
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}