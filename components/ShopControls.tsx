"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";

const CATEGORIES: { slug: string; key: string }[] = [
  { slug: "dashboard-idols", key: "dashboardIdols" },
  { slug: "shadu-mati-idols", key: "shaduMatiIdols" },
  { slug: "fiber-idols", key: "fiberIdols" },
  { slug: "pop-idols", key: "popIdols" },
];

const field =
  "rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function ShopControls() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { t } = useLocale();

  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    const current = params.get("q") || "";
    if (q === current) return;
    const id = setTimeout(() => {
      const sp = new URLSearchParams(Array.from(params.entries()));
      if (q) sp.set("q", q);
      else sp.delete("q");
      router.replace(`${pathname}?${sp.toString()}`);
    }, 350);
    return () => clearTimeout(id);
  }, [q, params, pathname, router]);

  function setParam(key: string, value: string, clearWhen: string) {
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (value && value !== clearWhen) sp.set(key, value);
    else sp.delete(key);
    router.replace(`${pathname}?${sp.toString()}`);
  }

  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        className={field + " flex-1"}
      />
      <select
        value={category}
        onChange={(e) => setParam("category", e.target.value, "all")}
        className={field}
      >
        <option value="all">{t.allCategories}</option>
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {t[c.key as keyof typeof t]}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value, "newest")}
        className={field}
      >
        <option value="newest">{t.sortNewest}</option>
        <option value="price-asc">{t.sortPriceLow}</option>
        <option value="price-desc">{t.sortPriceHigh}</option>
      </select>
    </div>
  );
}
