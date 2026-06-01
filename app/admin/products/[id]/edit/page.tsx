import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { updateProduct } from "../../../actions";
import { getProduct, CATEGORY_META, Category } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Edit Product" };

const field = "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const cats = Object.keys(CATEGORY_META) as Category[];
  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-8 mt-3 text-3xl">Edit Idol</h1>

      <form action={updateProduct} className="max-w-xl space-y-5 rounded-xl2 border border-line bg-white p-8">
        <input type="hidden" name="id" value={product.id} />

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input name="name" required defaultValue={product.name} className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Price (Rs)</label>
            <input name="price" type="number" min="0" required defaultValue={product.price} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Size</label>
            <input name="size" defaultValue={product.size ?? ""} className={field} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select name="category" required defaultValue={product.category} className={field}>
              {cats.map((c) => (
                <option key={c} value={c}>{CATEGORY_META[c].title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tag</label>
            <input name="tag" defaultValue={product.tag ?? ""} className={field} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea name="description" rows={3} defaultValue={product.description ?? ""} className={field} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          {product.image_url ? (
            <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-lg border border-line">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
          ) : null}
          <input name="image" type="file" accept="image/*" className={field} />
          <p className="mt-1 text-xs text-ink-soft">Leave empty to keep the current photo.</p>
        </div>

        <button type="submit" className="btn-primary w-full text-center">Update Idol</button>
      </form>
    </section>
  );
}