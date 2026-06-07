import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/format";

type Accessory = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
};

export default function AccessoryGrid({ accessories }: { accessories: Accessory[] }) {
  if (!accessories.length) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {accessories.map((a) => (
        <Link key={a.id} href={"/accessories/" + a.id} className="group block overflow-hidden rounded-xl2 border border-line bg-white transition hover:shadow-soft">
          <div className="relative aspect-square overflow-hidden bg-[#faf9f7]">
            {a.image_url ? (
              <Image src={a.image_url} alt={a.name} fill className="object-contain p-5 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
            ) : null}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold">{a.name}</h3>
            {a.subtitle && <p className="mt-0.5 text-xs text-ink-soft">{a.subtitle}</p>}
            <p className="mt-2 text-sm">{formatINR(a.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
