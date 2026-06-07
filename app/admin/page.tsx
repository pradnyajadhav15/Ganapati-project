import Link from "next/link";
import Image from "next/image";
import { getProducts, formatINR, CATEGORY_META } from "@/lib/products";
import { deleteProduct, logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Products" };

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <section className="site-wrap py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="text-ink-soft">{products.length} idols in catalogue</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/orders" className="btn-ghost">
            View Orders
          </Link>
          <Link href="/admin/bookings" className="btn-ghost">
            Pre-bookings
          </Link>
          <Link href="/admin/messages" className="btn-ghost">
            Messages
          </Link>
          <Link href="/admin/subscribers" className="btn-ghost">
            Subscribers
          </Link>
          <Link href="/admin/accessories" className="btn-ghost">
            Accessories
          </Link>
          <Link href="/admin/testimonials" className="btn-ghost">
            Testimonials
          </Link>
           <Link href="/admin/coupons" className="btn-ghost">
            Coupons
          </Link>
            <Link href="/admin/team" className="btn-ghost">
            Team
          </Link>
          <Link href="/admin/gallery" className="btn-ghost">
            Gallery
          </Link>
          <Link href="/admin/products/new" className="btn-primary">
            + Add Product
          </Link>
          <form action={logout}>
            <button className="btn-ghost">Log out</button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-deep text-ink-soft">
            <tr>
              <th className="p-4">Idol</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gradient-to-br from-peach to-rose">
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-xl">🪔</span>
                      )}
                    </div>
                    <span className="font-medium">
                      {p.name} {p.size}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-ink-soft">{CATEGORY_META[p.category]?.title}</td>
                <td className="p-4">{formatINR(p.price)}</td>
                <td className="p-4 text-right">
                  <Link href={"/admin/products/" + p.id + "/edit"} className="mr-2 rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-sage-deep transition hover:bg-cream-deep">Edit</Link>
                  <form action={deleteProduct} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-soft">
                  No products yet. Click "Add Product" to create your first idol.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
