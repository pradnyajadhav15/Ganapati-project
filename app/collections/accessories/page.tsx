import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { getAccessories } from "@/lib/accessories";
import { formatINR } from "@/lib/format";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ganpati Shastra & Accessories - R. Ramesh Arts Studio",
  description: "Clay tools, chakras and shastra sets to complete your Ganpati idol.",
};

export default async function AccessoriesPage() {
  const accessories = await getAccessories();
  const t = getDict(getLocale());

  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading kicker={t.toolsAccessories} title={t.ganpatiShastra} sub={t.shastraSub} />

      {accessories.length === 0 ? (
        <p className="text-center text-ink-soft">{t.emptyCollection}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {accessories.map((a) => (
              <div key={a.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="relative flex aspect-square w-full items-center justify-center bg-[#faf9f7] p-6">
                  {a.image_url ? (
                    <Image src={a.image_url} alt={a.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                  ) : null}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="mx-5 h-px bg-line" />
                <div className="flex flex-col items-center gap-1 px-5 py-4">
                  <span className="font-display text-[1.15rem] tracking-wide text-ink">{a.name}</span>
                  {a.subtitle ? (
                    <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/40">{a.subtitle}</span>
                  ) : null}
                  <span className="mt-2 font-display text-[1.1rem] text-terracotta">{formatINR(a.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
          </div>
        </>
      )}
    </section>
  );
}
