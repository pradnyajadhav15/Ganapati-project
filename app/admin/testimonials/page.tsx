import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/testimonial-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Testimonials" };

type Testimonial = {
  id: string;
  quote: string;
  customer_name: string;
  city: string | null;
  rating: number;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage-deep";

export default async function AdminTestimonialsPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("id,quote,customer_name,city,rating,image_url,sort_order,visible")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const items = (data ?? []) as Testimonial[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">
        Back to products
      </Link>
      <h1 className="mb-2 mt-3 text-3xl">Testimonials ({items.length})</h1>
      <p className="mb-8 max-w-2xl text-sm text-ink-soft">
        These show in the &quot;What Our Customers Say&quot; section on the homepage. Lower
        sort numbers appear first. Untick &quot;Visible&quot; to hide one without deleting it.
      </p>

      {/* Add new */}
      <div className="mb-10 rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 text-lg">Add a testimonial</h2>
        <form action={createTestimonial} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            Quote
            <textarea name="quote" required rows={3} className={inputClass} placeholder="What the customer said..." />
          </label>
          <label className="text-sm">
            Customer name
            <input name="customer_name" required className={inputClass} placeholder="Rohan Patil" />
          </label>
          <label className="text-sm">
            City
            <input name="city" className={inputClass} placeholder="Pune" />
          </label>
          <label className="text-sm">
            Rating (1-5)
            <input name="rating" type="number" min="1" max="5" step="1" defaultValue={5} className={inputClass} />
          </label>
          <label className="text-sm">
            Sort order
            <input name="sort_order" type="number" step="1" defaultValue={items.length + 1} className={inputClass} />
          </label>
          <label className="text-sm md:col-span-2">
            Photo (optional)
            <input name="image" type="file" accept="image/*" className={inputClass} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">Add testimonial</button>
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-ink-soft">No testimonials yet. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl2 border border-line bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-full border border-line bg-[#faf9f7]">
                  {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image_url} alt={item.customer_name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-center text-[10px] text-ink/40">No photo</span>
                  )}
                </div>

                <form action={updateTestimonial} className="grid flex-1 gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={item.id} />
                  <label className="text-sm md:col-span-2">
                    Quote
                    <textarea name="quote" defaultValue={item.quote} required rows={3} className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Customer name
                    <input name="customer_name" defaultValue={item.customer_name} required className={inputClass} />
                  </label>
                  <label className="text-sm">
                    City
                    <input name="city" defaultValue={item.city ?? ""} className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Rating (1-5)
                    <input name="rating" type="number" min="1" max="5" step="1" defaultValue={item.rating} className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Sort order
                    <input name="sort_order" type="number" step="1" defaultValue={item.sort_order} className={inputClass} />
                  </label>
                  <label className="text-sm md:col-span-2">
                    Replace photo (leave empty to keep current)
                    <input name="image" type="file" accept="image/*" className={inputClass} />
                  </label>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" name="visible" defaultChecked={item.visible} />
                    Visible on homepage
                  </label>
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary">Save changes</button>
                  </div>
                </form>
              </div>

              <form action={deleteTestimonial} className="mt-3 border-t border-line pt-3">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-sm text-rose underline">
                  Delete this testimonial
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
