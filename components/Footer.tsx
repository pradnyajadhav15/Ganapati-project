import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";
import NewsletterSignup from "@/components/NewsletterSignup";

const socials = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@R.RameshArts",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_r.ramesharts_?igsh=MWFqbXdpNjN5dXFkNw==",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1zm0 3.3A6.5 6.5 0 1 0 18.5 12 6.5 6.5 0 0 0 12 5.5zm0 10.7A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2zm6.8-10.9a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/917020290393",
    path: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.06 1.6 5.82L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.74c5.46 0 9.91-4.45 9.91-9.91a9.82 9.82 0 0 0-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.68 13.29c-.23.65-1.34 1.24-1.88 1.32-.48.07-1.09.1-1.76-.11-.4-.13-.92-.3-1.59-.59-2.81-1.21-4.64-4.04-4.78-4.22-.14-.19-1.14-1.51-1.14-2.88 0-1.37.71-2.04.97-2.32.25-.28.56-.35.74-.35l.54.01c.17.01.4-.07.63.48.23.56.79 1.93.86 2.07.07.14.11.31.02.49-.1.18-.14.3-.28.46-.14.17-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.96 1.97 1.25 2.25 1.39.28.14.44.11.6-.07.16-.19.7-.82.88-1.1.19-.28.37-.23.63-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.11.07.67-.16 1.32z",
  },
] as const;

export default function Footer() {
  const locale = getLocale();
  const t = getDict(locale);

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(170deg,#7E9676_0%,#6B8264_45%,#54684E_100%)] pb-8 pt-16 text-[#f3ede2]">
      {/* gold hairline along the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold-sheen opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_420px_at_20%_-10%,rgba(255,255,255,.12),transparent_60%)]"
      />

      <div className="site-wrap relative">
        <NewsletterSignup />

        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <h4 className="font-display text-[1.45rem] text-white">R. Ramesh Arts Studio</h4>
            <div className="mt-3 flex items-center gap-2" aria-hidden="true">
              <span className="h-px w-9 bg-gold-light/70" />
              <span className="h-1 w-1 rotate-45 bg-gold-light/80" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-85">{t.footerTagline}</p>

            <div className="mt-5 space-y-2.5 text-sm opacity-85">
              <p className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 h-4 w-4 flex-none text-gold-light">
                  <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                34/A1/26, Geeta Nagar, New Paccha Peth, Solapur, 413005
              </p>
              <p className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 flex-none text-gold-light">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
                <a href="tel:+917020290393" className="transition-opacity hover:opacity-100">+91 70202 90393</a>
              </p>
            </div>

            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light hover:bg-white/10 hover:text-gold-light"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <FootCol
            title={t.quickLinks}
            items={[
              [t.aboutUs, "/about"],
              [t.contactUs, "/contact"],
              [t.faq, "/faq"],
              [t.initiative, "/initiative"],
              [t.collections, "/collections/shadu-mati-idols"],
              [t.news, "/media-coverage"],
              ["Our Stories", "/blog"],
            ]}
          />
          <FootCol
            title={t.policies}
            items={[
              [t.refundPolicy, "/refund-policy"],
              [t.shippingPolicy, "/shipping-policy"],
              [t.termsOfService, "/terms"],
              [t.privacyPolicy, "/privacy"],
            ]}
          />
          <FootCol
            title={t.follow}
            items={[
              ["YouTube", "https://www.youtube.com/@R.RameshArts"],
              ["Instagram", "https://www.instagram.com/_r.ramesharts_?igsh=MWFqbXdpNjN5dXFkNw=="],
              ["WhatsApp", "https://wa.me/917020290393"],
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/20 pt-6 text-[0.8rem] opacity-75 sm:flex-row sm:justify-between">
          <span>{t.footerCopyright}</span>
          <span className="flex items-center gap-2 uppercase tracking-[0.2em]">
            <span className="h-1 w-1 rotate-45 bg-gold-light/70" />
            Handcrafted in Solapur
          </span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="mb-4 text-[0.72rem] uppercase tracking-[0.22em] text-gold-light/90">
        {title}
      </div>
      <ul className="space-y-2.5 text-sm">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 opacity-85 transition-all duration-300 hover:opacity-100"
            >
              <span className="h-px w-0 bg-gold-light transition-all duration-300 group-hover:w-3" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
