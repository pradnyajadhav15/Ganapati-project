"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/admin/overview", label: "Overview" },
  { href: "/admin", label: "Products", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/today", label: "Today" },
  { href: "/admin/bookings", label: "Pre-bookings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/accessories", label: "Accessories" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/subscribers", label: "Subscribers" },
] as const;

/**
 * Persistent section nav for the admin area. Before this, every page except
 * the products list carried a single "back to products" link, so moving
 * between sections meant hopping through /admin each time.
 *
 * Renders nothing on the login screen — there is nothing to navigate to yet.
 */
export default function AdminNav({ logout }: { logout: () => Promise<void> }) {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/admin/login")) return null;

  return (
    <div className="sticky top-[78px] z-40 border-b border-line bg-cream-warm/95 backdrop-blur">
      <div className="site-wrap flex items-center gap-3 py-2.5">
        <nav aria-label="Admin sections" className="flex flex-1 gap-1 overflow-x-auto">
          {SECTIONS.map((s) => {
            const active =
              "exact" in s && s.exact ? pathname === s.href : pathname.startsWith(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors duration-200 " +
                  (active
                    ? "bg-ink text-cream"
                    : "text-ink-soft hover:bg-cream-deep hover:text-ink")
                }
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="flex-none">
          <button className="whitespace-nowrap rounded-full border border-line px-3.5 py-1.5 text-[0.82rem] font-medium text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
