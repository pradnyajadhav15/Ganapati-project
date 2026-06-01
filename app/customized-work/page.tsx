import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Customized Work - R. Ramesh Arts Studio" };

const steps = [
  { n: "01", h: "Share Your Vision", p: "Tell us the deity, size, pose and theme you imagine." },
  { n: "02", h: "We Sketch & Quote", p: "Our artists share a concept and clear, transparent pricing." },
  { n: "03", h: "Hand-Sculpted & Painted", p: "Your idol is shaped by hand and finished with rich, vibrant colours." },
  { n: "04", h: "Delivered with Care", p: "Carefully packed and delivered in time for the festival." },
];

export default function Page() {
  return (
    <>
      <PageHero kicker="Made Just For You" title="Customized Work" swatch="from-sage to-cream-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl text-center text-ink-soft">
          <p className="text-lg leading-relaxed">
            Want a one-of-a-kind idol? We craft bespoke Ganpati murtis to your
            exact size, pose and decoration, in plaster, Shadu Mati or fiber,
            finished with our signature colour and fine detailing. Bulk orders
            for mandals and societies are warmly welcome.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl2 border border-line bg-white p-7">
              <div className="font-display text-3xl text-terracotta">{s.n}</div>
              <h3 className="mb-1.5 mt-3 text-[1.15rem]">{s.h}</h3>
              <p className="text-[0.9rem] text-ink-soft">{s.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/contact" className="btn-primary">Request a Custom Idol</Link>
        </div>
      </section>
    </>
  );
}