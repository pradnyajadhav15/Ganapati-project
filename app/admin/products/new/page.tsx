import Link from "next/link";
import { createProduct } from "../../actions";
import { CATEGORY_META, Category } from "@/lib/products";

export const metadata = { title: "Admin - Add Product" };

const field = "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function NewProductPage() {
  const cats = Object.keys(CATEGORY_META) as Category[];
  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-8 mt-3 text-3xl">Add a New Idol</h1>

      <form action={createProduct} className="max-w-xl space-y-5 rounded-xl2 border border-line bg-white p-8">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input name="name" required placeholder="Bal Ganesh" className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Price (Rs)</label>
            <input name="price" type="number" min="0" required placeholder="1100" className={field} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Size</label>
            <input name="size" placeholder="8 inch" className={field} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select name="category" required className={field}>
              {cats.map((c) => (
                <option key={c} value={c}>{CATEGORY_META[c].title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tag</label>
            <input name="tag" placeholder="Shadu Mati" className={field} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea name="description" rows={3} className={field} placeholder="Short description" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          <input name="image" type="file" accept="image/*" className={field} />
          <p className="mt-1 text-xs text-ink-soft">Optional now - leave empty to use a placeholder.</p>
        </div>

        <button type="submit" className="btn-primary w-full text-center">Save Idol</button>
      </form>
    </section>
  );
}