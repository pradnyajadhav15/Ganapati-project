import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import {
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from "@/app/admin/accessory-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Accessories" };

type Accessory = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
  image_urls: string[] | null;
  sort_order: number;
  visible: boolean;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage-deep";

export default async function AdminAccessoriesPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("accessories")
    .select("id,name,subtitle,price,image_url,sort_order,visible,image_urls")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const items = (data ?? []) as Accessory[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">
        Back to products
      </Link>
      <h1 className="mb-2 mt-3 text-3xl">Ganpati Shastra / Accessories ({items.length})</h1>
      <p className="mb-8 max-w-2xl text-sm text-ink-soft">
        These show in the &quot;Ganpati Shastra&quot; section on the homepage. Lower sort
        numbers appear first. Untick &quot;Visible&quot; to hide an item without deleting it.
      </p>

      {/* Add new */}
      <div className="mb-10 rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 text-lg">Add a new accessory</h2>
        <form action={createAccessory} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Name
            <input name="name" required className={inputClass} placeholder="Clay Tools" />
          </label>
          <label className="text-sm">
            Subtitle (small label)
            <input name="subtitle" className={inputClass} placeholder="Wooden Set" />
          </label>
          <label className="text-sm">
            Price (INR)
            <input name="price" type="number" min="0" step="1" required className={inputClass} placeholder="150" />
          </label>
          <label className="text-sm">
            Sort order
            <input name="sort_order" type="number" step="1" defaultValue={items.length + 1} className={inputClass} />
          </label>
          <label className="text-sm md:col-span-2">
            Photo
            <input name="image" type="file" accept="image/*" className={inputClass} />
          </label>
          <label className="text-sm md:col-span-2">
            Additional photos (optional)
            <input name="images" type="file" accept="image/*" multiple className={inputClass} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">Add accessory</button>
          </div>
        </form>
      </div>

      {/* Existing list */}
      {items.length === 0 ? (
        <p className="text-ink-soft">No accessories yet. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="rounded-xl2 border border-line bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex h-28 w-28 flex-none items-center justify-center overflow-hidden rounded-lg border border-line bg-[#faf9f7]">
                  {a.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={a.image_url} alt={a.name} className="h-full w-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-ink/40">No image</span>
                  )}
                </div>

                <form action={updateAccessory} className="grid flex-1 gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={a.id} />
                  <label className="text-sm">
                    Name
                    <input name="name" defaultValue={a.name} required className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Subtitle
                    <input name="subtitle" defaultValue={a.subtitle ?? ""} className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Price (INR)
                    <input name="price" type="number" min="0" step="1" defaultValue={a.price} required className={inputClass} />
                  </label>
                  <label className="text-sm">
                    Sort order
                    <input name="sort_order" type="number" step="1" defaultValue={a.sort_order} className={inputClass} />
                  </label>
                  <label className="text-sm md:col-span-2">
                    Replace photo (leave empty to keep current)
                    <input name="image" type="file" accept="image/*" className={inputClass} />
                  </label>
                  <div className="text-sm md:col-span-2">
                    Additional photos
                    {a.image_urls && a.image_urls.length > 0 ? (
                      <div className="mb-2 mt-1 flex flex-wrap gap-2">
                        {a.image_urls.map((src, i) => (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img key={i} src={src} alt={a.name + " " + (i + 1)} className="h-16 w-16 rounded-lg border border-line object-cover" />
                        ))}
                      </div>
                    ) : null}
                    <input name="images" type="file" accept="image/*" multiple className={inputClass} />
                    <label className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
                      <input type="checkbox" name="clear_images" />
                      Remove existing extra photos before adding new ones
                    </label>
                  </div>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" name="visible" defaultChecked={a.visible} />
                    Visible on homepage
                  </label>
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary">Save changes</button>
                  </div>
                </form>
              </div>

              <form action={deleteAccessory} className="mt-3 border-t border-line pt-3">
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="text-sm text-rose underline">
                  Delete this accessory
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
