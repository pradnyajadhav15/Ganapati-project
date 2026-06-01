"use client";

import { createContext, useContext } from "react";
import { getDict, type Locale, type Dict } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; t: Dict } | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getDict(locale);
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}