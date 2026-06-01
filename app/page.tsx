import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { getProducts } from "@/lib/products";
import { formatINR } from "@/lib/format";
import Testimonials from "@/components/Testimonials";

export const dynamic = "force-dynamic";

const shastra = [
  { name: "Clay Tools",  subtitle: "Fiber Set",  price: 150, img: "/images/shastra/cray-tools-fiber.jpg" },
  { name: "Clay Tools",  subtitle: "Wooden Set", price: 150, img: "/images/shastra/cray-tools-wooden.jpg" },
  { name: "Chakra 3 Inches",      subtitle: "Decorative", price: 120, img: "/images/shastra/chakra-1.jpg" },
  { name: "Chakra 6 Inches",      subtitle: "Decorative", price: 120, img: "/images/shastra/chakra-2.jpg" },
  { name: "Shastra Set", subtitle: "Weapons",    price: 250, img: "/images/shastra/shastra-1.jpg" },
];

const features = [
  {
    h: "Fine Detailing",
    p: "Crisp, intricate craftsmanship on every idol.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </svg>
    ),
  },
  {
    h: "Vibrant Finish",
    p: "Rich, hand-painted colours that last.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" />
      </svg>
    ),
  },
  {
    h: "Many Materials",
    p: "Plaster, Shadu Mati and fiber options.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3 3 8l9 5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </svg>
    ),
  },
  {
    h: "Easy to Handle",
    p: "Lightweight, sturdy and travel-friendly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
];

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[radial-gradient(1200px_600px_at_80%_20%,rgba(242,201,168,.55),transparent_60%),radial-gradient(900px_500px_at_10%_80%,rgba(175,194,168,.45),transparent_60%)]">
        <div className="site-wrap grid w-full items-center gap-10 md:grid-cols-[1.05fr_.95fr]">
          <div className="reveal">
            <div className="mb-5 text-[0.78rem] uppercase tracking-[0.34em] text-sage-deep">
              Handcrafted &middot; Hand-Painted &middot; Ganesh Idols
            </div>
            <h1 className="text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02]">
              Devotion,<br />
              sculpted in <span className="italic text-terracotta">clay</span>.
            </h1>
            <p className="my-6 max-w-md font-display text-[1.15rem] italic leading-relaxed text-ink-soft">
              Beautifully detailed, hand-painted idols &mdash; crafted to bring
              your celebration to life.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/collections/shadu-mati-idols" className="btn-primary">Explore Collections</Link>
              <Link href="/customized-work" className="btn-ghost">Book for 2026</Link>
            </div>
          </div>

          <div className="reveal relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[200px_200px_24px_24px] bg-gradient-to-br from-peach to-rose shadow-soft [animation-delay:.15s]">
            <div className="absolute inset-[18px] rounded-[190px_190px_16px_16px] border-2 border-dashed border-white/60" />
            <Image src="/images/hero-idol.jpg" alt="Handcrafted Ganesha idol" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="site-wrap py-[90px]">
        <SectionHeading kicker="Our Collections" title="Featured Murtis" sub="Each idol is hand-sculpted and finished with rich, vibrant colours." />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/collections/shadu-mati-idols" className="btn-ghost">View All</Link>
        </div>
      </section>

      {/* GANPATI SHASTRA */}
      <section className="bg-cream-deep py-[90px]">
        <div className="site-wrap">
          <SectionHeading kicker="Tools & Accessories" title="Ganpati Shastra" sub="Clay tools, chakras and shastra sets to complete your idol." />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {shastra.map((s, i) => (
              <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="relative flex aspect-square w-full items-center justify-center bg-[#faf9f7] p-6">
                  <Image src={s.img} alt={s.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="mx-5 h-px bg-line" />
                <div className="flex flex-col items-center gap-1 px-5 py-4">
                  <span className="font-display text-[1.15rem] tracking-wide text-ink">{s.name}</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/40">{s.subtitle}</span>
                  <span className="mt-2 font-display text-[1.1rem] text-terracotta">{formatINR(s.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">Enquire on WhatsApp</a>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* WHY */}
      <section className="site-wrap py-[90px]">
        <SectionHeading kicker="Why Choose Us" title="Crafted with Care" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.h} className="rounded-xl border border-line bg-white px-6 py-8 text-center">
              <div className="mx-auto mb-4 grid h-[58px] w-[58px] place-items-center rounded-2xl bg-sage text-white">{f.icon}</div>
              <h3 className="mb-1.5 text-[1.1rem]">{f.h}</h3>
              <p className="text-[0.86rem] text-ink-soft">{f.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}