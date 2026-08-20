import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CartIcon from "@/components/CartIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import NavShell from "@/components/NavShell";
import { getDict, type Dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const links = [
  { href: "/customized-work", key: "customizedWork" },
  { href: "/our-work", key: "ourWork" },
  { href: "/partnership", key: "partnership" },
  { href: "/initiative", key: "initiative" },
  { href: "/media-coverage", key: "mediaCoverage" },
] as const;

const collections = [
  { href: "/shop", key: "shopAll" },
  { href: "/collections/dashboard-idols", key: "dashboardIdols" },
  { href: "/collections/shadu-mati-idols", key: "shaduMatiIdols" },
  { href: "/collections/fiber-idols", key: "fiberIdols" },
  { href: "/collections/pop-idols", key: "popIdols" },
  { href: "/collections/accessories", key: "ganpatiShastra" },
  { href: "/materials", key: "chooseMaterial" },
] as const;

export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocale();
  const t = getDict(locale);

  const collectionItems = collections.map((c) => ({ href: c.href, label: t[c.key as keyof Dict] }));
  const linkItems = links.map((l) => ({ href: l.href, label: t[l.key as keyof Dict] }));

  return (
    <NavShell>
      <div className="site-wrap flex h-[78px] items-center justify-between gap-2 sm:gap-4 xl:gap-6">
        {/* Brand */}
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <span className="relative grid h-[42px] w-[42px] flex-none place-items-center sm:h-[52px] sm:w-[52px]">
            {/* gold ring */}
            <span className="absolute inset-0 rounded-full bg-gold-sheen opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-[1.5px] rounded-full bg-cream" />
            <span className="relative h-[37px] w-[37px] overflow-hidden rounded-full sm:h-[46px] sm:w-[46px]">
              <Image
                src="/images/logo.png"
                alt="R. Ramesh Arts Studio logo"
                fill
                sizes="46px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </span>
          </span>
          <span className="min-w-0 leading-none">
            <b className="block truncate font-display text-[0.95rem] font-semibold tracking-wide text-ink sm:text-[1.08rem]">
              R. Ramesh Arts
            </b>
            <span className="mt-1 hidden text-[0.6rem] uppercase tracking-[0.42em] text-gold-deep/80 sm:block">
              Studio
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-4 whitespace-nowrap text-[0.86rem] xl:flex xl:gap-5 2xl:gap-7">
          <Link href="/" className="nav-link">
            {t.home}
          </Link>

          <div className="group relative">
            <button className="nav-link inline-flex items-center gap-1.5">
              {t.ourCollections}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="invisible absolute left-[-18px] top-[150%] min-w-[228px] origin-top scale-95 rounded-2xl border border-line-soft bg-white/95 p-2 opacity-0 shadow-lift backdrop-blur-md transition-all duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
              <span className="absolute -top-1.5 left-9 h-3 w-3 rotate-45 border-l border-t border-line-soft bg-white" />
              <div className="relative">
                {collections.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group/i flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[0.9rem] text-ink-soft transition-colors duration-200 hover:bg-cream-deep hover:text-ink"
                  >
                    {t[c.key as keyof Dict]}
                    <span className="translate-x-[-4px] text-gold opacity-0 transition-all duration-300 group-hover/i:translate-x-0 group-hover/i:opacity-100">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {t[l.key as keyof Dict]}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex flex-none items-center gap-2 text-[0.92rem] sm:gap-3">
          <LanguageSwitcher current={locale} />
          {user ? (
            <Link href="/account" className="nav-link hidden xl:block">
              {t.account}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border-[1.5px] border-ink/80 px-4 py-1.5 font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-cream hover:shadow-lux xl:block"
            >
              {t.logIn}
            </Link>
          )}
          <CartIcon />
          <MobileMenu
            home={t.home}
            ourCollections={t.ourCollections}
            collections={collectionItems}
            links={linkItems}
          />
        </div>
      </div>
    </NavShell>
  );
}
