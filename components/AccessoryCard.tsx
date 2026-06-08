import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/format";
import AddToCartButtons from "@/components/AddToCartButtons";

type Accessory = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
};

export default function AccessoryCard({ accessory }: { accessory: Accessory }) {
  const waText = encodeURIComponent("Hi, I'm interested in " + accessory.name + ".");
  const waHref = "https://wa.me/917020290393?text=" + waText;

  return (
    <div className="group overflow-hidden rounded-xl2 border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-soft">
      <Link href={"/accessories/" + accessory.id}>
        <div className="relative aspect-square overflow-hidden bg-[#faf9f7]">
          {accessory.image_url ? (
            <Image src={accessory.image_url} alt={accessory.name} fill sizes="(max-width:768px) 50vw, 20vw" className="object-contain p-5 transition group-hover:scale-105" />
          ) : null}
        </div>
      </Link>
      <div className="p-[18px]">
        <h3 className="mb-1 mt-1 text-[1.05rem]">{accessory.name}</h3>
        {accessory.subtitle && <p className="-mt-0.5 mb-1 text-xs text-ink-soft">{accessory.subtitle}</p>}
        <div className="font-display text-[1.2rem] text-terracotta">{formatINR(accessory.price)}</div>
        <AddToCartButtons product={{ id: accessory.id, name: accessory.name, price: accessory.price, size: accessory.subtitle, image_url: accessory.image_url, kind: "accessory" }} />
        <a href={waHref} target="_blank" rel="noreferrer" className="mt-2 block rounded-full border border-sage py-2 text-center text-[0.8rem] font-semibold text-sage-deep transition hover:bg-sage hover:text-white">Order on WhatsApp</a>
      </div>
    </div>
  );
}
