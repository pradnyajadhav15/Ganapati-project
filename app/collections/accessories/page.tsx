import SectionHeading from "@/components/SectionHeading";
import AccessoryGrid from "@/components/AccessoryGrid";
import { getAccessories } from "@/lib/accessories";
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
          <AccessoryGrid accessories={accessories} />
          <div className="mt-12 text-center">
            <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
          </div>
        </>
      )}
    </section>
  );
}
