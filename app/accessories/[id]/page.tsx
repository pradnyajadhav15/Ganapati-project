import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import AddAccessoryToCart from "@/components/AddAccessoryToCart";

export const dynamic = "force-dynamic";

export default async function AccessoryDetailPage({ params }: { params: { id: string } }) {
  const { data: a } = await supabaseAdmin
    .from("accessories")
    .select("id,name,subtitle,price,image_url,visible")
    .eq("id", params.id)
    .single();
  if (!a || a.visible === false) notFound();

  return (
    <section className="site-wrap py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl2 border border-line bg-[#faf9f7]">
          {a.image_url ? (
            <Image src={a.image_url} alt={a.name} fill className="object-contain p-8" sizes="(max-width: 768px) 100vw, 50vw" priority />
          ) : null}
        </div>
        <div className="flex flex-col">
          <div className="text-[0.72rem] uppercase tracking-[0.3em] text-sage-deep">Ganpati Shastra</div>
          <h1 className="mt-2 text-3xl">{a.name}</h1>
          {a.subtitle && <p className="mt-1 text-ink-soft">{a.subtitle}</p>}
          <p className="mt-6 font-display text-3xl text-terracotta">{formatINR(a.price)}</p>
          <div className="mt-8">
            <AddAccessoryToCart id={a.id} name={a.name} price={a.price} image_url={a.image_url} />
          </div>
          <p className="mt-6 text-sm text-ink-soft">Handpicked tools and accessories that pair with our handcrafted Ganpati idols.</p>
        </div>
      </div>
    </section>
  );
}
