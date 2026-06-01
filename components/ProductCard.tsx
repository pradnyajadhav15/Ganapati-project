import Link from "next/link";
import Image from "next/image";
import { Product, formatINR } from "@/lib/products";
import AddToCartButtons from "@/components/AddToCartButtons";

export default function ProductCard({ product }: { product: Product }) {
  const waText = encodeURIComponent("Hi, I'm interested in " + product.name + (product.size ? " " + product.size : "") + ".");
  const waHref = "https://wa.me/917020290393?text=" + waText;

  return (
    <div className="group overflow-hidden rounded-xl2 border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-soft">
      <Link href={"/product/" + product.id}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-peach to-rose">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="font-display text-lg italic text-white/70">R. Ramesh Arts</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-[18px]">
        {product.tag && (
          <span className="rounded-full bg-cream-deep px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-sage-deep">{product.tag}</span>
        )}
        <h3 className="mb-1 mt-2.5 text-[1.15rem]">{product.name}{product.size ? " " + product.size : ""}</h3>
        <div className="font-display text-[1.2rem] text-terracotta">{formatINR(product.price)}</div>
        <AddToCartButtons product={{ id: product.id, name: product.name, price: product.price, size: product.size, image_url: product.image_url }} />
        <a href={waHref} target="_blank" rel="noreferrer" className="mt-2 block rounded-full border border-sage py-2 text-center text-[0.8rem] font-semibold text-sage-deep transition hover:bg-sage hover:text-white">Order on WhatsApp</a>
      </div>
    </div>
  );
}