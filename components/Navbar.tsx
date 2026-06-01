import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CartIcon from "@/components/CartIcon";
import Image from "next/image";

const links = [
  { href: "/customized-work", label: "Customized Work" },
  { href: "/partnership", label: "Partnership" },
  { href: "/initiative", label: "Initiative" },
  { href: "/media-coverage", label: "Media Coverage" },
];

const collections = [
  { href: "/collections/dashboard-idols", label: "Dashboard Idols" },
  { href: "/collections/shadu-mati-idols", label: "Shadu Mati Idols" },
  { href: "/collections/fiber-idols", label: "Fiber Idols" },
  { href: "/collections/pop-idols", label: "Pop Idols" },
];

export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            Home
          </Link>

          <div className="group relative">
            <button className="text-ink-soft transition group-hover:text-ink">
              Our Collections ⌄
            </button>
            <div className="invisible absolute left-[-16px] top-[130%] min-w-[200px] translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-soft transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {collections.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="block rounded-lg px-3.5 py-2.5 text-[0.9rem] text-ink-soft hover:bg-cream-deep hover:text-ink"
                >
                  {c.label}
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
              {l.label}
            </Link>
          ))}
        </div>

        {/* Account + cart */}
        <div className="flex items-center gap-4 text-[0.92rem]">
          {user ? (
            <Link href="/account" className="text-ink-soft transition hover:text-ink">
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border-[1.5px] border-ink px-4 py-1.5 text-ink transition hover:bg-ink hover:text-cream"
            >
              Log In
            </Link>
          )}
          <CartIcon />
        </div>
      </div>
    </nav>
  );
}