import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-sage-deep pb-7 pt-16 text-[#f3ede2]">
      <div className="site-wrap">
        <div className="grid gap-9 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <h4 className="mb-2 font-display text-xl text-white">
              R. Ramesh Arts Studio
            </h4>
            <p className="max-w-xs text-sm opacity-85">
              Handcrafted Ganesh idols in plaster, Shadu Mati and fiber —
              beautifully detailed and hand-painted, made with devotion in
              Solapur.
            </p>
            <div className="mt-4 space-y-1 text-sm opacity-85">
              <p>34/A1/26, Geeta Nagar, New Paccha Peth, Solapur, 413005</p>
              <p>
                <a href="tel:+917020290393" className="hover:opacity-100">
                  +91 70202 90393
                </a>
              </p>
            </div>
          </div>

          <FootCol
            title="Quick Links"
            items={[
              ["About Us", "/about"],
              ["Contact Us", "/contact"],
              ["Initiative", "/initiative"],
              ["Collections", "/collections/shadu-mati-idols"],
              ["News", "/media-coverage"],
            ]}
          />
          <FootCol
            title="Policies"
            items={[
              ["Refund Policy", "/refund-policy"],
              ["Shipping Policy", "/shipping-policy"],
              ["Terms of Service", "/terms"],
              ["Privacy Policy", "/privacy"],
            ]}
          />
          <FootCol
            title="Follow"
            items={[
              ["YouTube", "https://www.youtube.com/@R.RameshArts"],
              ["Instagram", "https://www.instagram.com/_r.ramesharts_?igsh=MWFqbXdpNjN5dXFkNw=="],
              ["WhatsApp", "https://wa.me/917020290393"],
            ]}
          />
        </div>

        <div className="mt-11 border-t border-white/20 pt-5 text-center text-[0.8rem] opacity-70">
          © 2026 R. Ramesh Arts Studio · Solapur · Built with devotion.
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="mb-4 text-[0.74rem] uppercase tracking-[0.2em] opacity-70">
        {title}
      </div>
      <ul className="space-y-2.5 text-sm">
        {items.map(([label, href]) => (
          <li key={label} className="opacity-85 transition hover:opacity-100">
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}