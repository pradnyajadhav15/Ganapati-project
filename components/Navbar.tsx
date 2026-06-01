import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CartIcon from "@/components/CartIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDict, type Dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const links = [
  { href: "/customized-work", key: "customizedWork" },
  { href: "/partnership", key: "partnership" },
  { href: "/initiative", key: "initiative" },
  { href: "/media-coverage", key: "mediaCoverage" },
] as const;

const collections = [
  { href: "/collections/dashboard-idols", key: "dashboardIdols" },
  { href: "/collections/shadu-mati-idols", key: "shaduMatiIdols" },
  { href: "/collections/fiber-idols", key: "fiberIdols" },
  { href: "/collections/pop-idols", key: "popIdols" },
] as const;

export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocale();
  const t = getDict(locale);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="site-wrap flex h-[78px] items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full border-[1.5px] border-ink">
            <Image
              src="/images/logo.png"
              alt="R. Ramesh Arts Studio logo"
              fill
              sizes="46px"
              className="object-cover"
              priority
            />
          </div>
          <span className="leading-none">
            <b className="block font-display text-[1.05rem] font-semibold tracking-wide">
              R. Ramesh Arts
            </b>
            <span className="block text-[0.62rem] uppercase tracking-[0.42em] text-ink-soft">
              Studio
            </span>
          </span>
        </Link>

        {/* Menu */}
        <div className="hidden items-center gap-8 text-[0.92rem] md:flex">
          <Link href="/" className="text-ink-soft transition hover:text-ink">
            {t.home}
          </Link>

          <div className="group relative">
            <button className="text-ink-soft transition group-hover:text-ink">
              {t.ourCollections} ⌄
            </button>
            <div className="invisible absolute left-[-16px] top-[130%] min-w-[200px] translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-soft transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {collections.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="block rounded-lg px-3.5 py-2.5 text-[0.9rem] text-ink-soft hover:bg-cream-deep hover:text-ink"
                >
                  {t[c.key as keyof Dict]}
                </Link>
              ))}
            </div>
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink-soft transition hover:text-ink"
            >
              {t[l.key as keyof Dict]}
            </Link>
          ))}
        </div>

        {/* Language + account + cart */}
        <div className="flex items-center gap-3 text-[0.92rem]">
          <LanguageSwitcher current={locale} />
          {user ? (
            <Link href="/account" className="text-ink-soft transition hover:text-ink">
              {t.account}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border-[1.5px] border-ink px-4 py-1.5 text-ink transition hover:bg-ink hover:text-cream"
            >
              {t.logIn}
            </Link>
          )}
          <CartIcon />
        </div>
      </div>
    </nav>
  );
}