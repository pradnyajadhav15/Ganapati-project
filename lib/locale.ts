import { cookies } from "next/headers";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export function getLocale(): Locale {
  const c = cookies().get("locale")?.value as Locale | undefined;
  return c && (LOCALES as readonly string[]).includes(c) ? c : DEFAULT_LOCALE;
}