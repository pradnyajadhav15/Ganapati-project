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
    <div className="card-lux group flex flex-col overflow-hidden">
      <Link href={"/accessories/" + accessory.id} className="block">
        <div className="relative aspect-square overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#ffffff_0%,#faf7f1_60%,#f2ebe0_100%)]">
          {accessory.image_url ? (
            <Image
              src={accessory.image_url}
              alt={accessory.name}
              fill
              sizes="(max-width:768px) 50vw, 20vw"
              className="object-contain p-5 transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.09]"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gold/0 transition-colors duration-700 group-hover:bg-gold/[0.06]" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-[18px]">
        <h3 className="mt-1 text-[1.05rem] leading-snug transition-colors duration-300 group-hover:text-terracotta-deep">
          {accessory.name}
        </h3>
        {accessory.subtitle && <p className="mt-1 text-xs text-ink-soft">{accessory.subtitle}</p>}
        <div className="mt-2 font-display text-[1.22rem] font-semibold text-terracotta-deep">
          {formatINR(accessory.price)}
        </div>
        <div className="my-3.5 rule-gold" />
        <div className="mt-auto">
          <AddToCartButtons product={{ id: accessory.id, name: accessory.name, price: accessory.price, size: accessory.subtitle, image_url: accessory.image_url, kind: "accessory" }} />
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-sage py-2 text-center text-[0.8rem] font-semibold text-sage-deep transition-all duration-300 hover:border-sage-deep hover:bg-sage-deep hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.06 1.6 5.82L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.74c5.46 0 9.91-4.45 9.91-9.91a9.82 9.82 0 0 0-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
