import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "@/app/admin/gallery-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Gallery" };

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  visible: boolean;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage-deep";

export default async function AdminGalleryPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("gallery")
    .select("id,image_url,caption,sort_order,visible")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const items = (data ?? []) as GalleryImage[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">
        Back to products
      </Link>
      <h1 className="mb-2 mt-3 text-3xl">Our Work Gallery ({items.length})</h1>
      <p className="mb-8 max-w-2xl text-sm text-ink-soft">
        These photos show on the public &quot;Our Work&quot; page. Lower sort numbers appear
        first. Untick &quot;Visible&quot; to hide a photo without deleting it.
      </p>

      <div className="mb-10 rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 text-lg">Add a photo</h2>
        <form action={createGalleryImage} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            Photo
            <input name="image" type="file" accept="image/*" required className={inputClass} />
          </label>
          <label className="text-sm">
            Caption (optional)
            <input name="caption" className={inputClass} placeholder="Custom 5ft idol for a Pune mandal" />
          </label>
          <label className="text-sm">
            Sort order
            <input name="sort_order" type="number" step="1" defaultValue={items.length + 1} className={inputClass} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">Add photo</button>
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-ink-soft">No photos yet. Add one above.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="rounded-xl2 border border-line bg-white p-4">
              <div className="mb-3 overflow-hidden rounded-lg border border-line bg-[#faf9f7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.image_url} alt={g.caption || "Gallery photo"} className="h-44 w-full object-cover" />
              </div>
              <form action={updateGalleryImage} className="space-y-3">
                <input type="hidden" name="id" value={g.id} />
                <label className="block text-sm">
                  Caption
                  <input name="caption" defaultValue={g.caption ?? ""} className={inputClass} />
                </label>
                <label className="block text-sm">
                  Sort order
                  <input name="sort_order" type="number" step="1" defaultValue={g.sort_order} className={inputClass} />
                </label>
                <label className="block text-sm">
                  Replace photo (optional)
                  <input name="image" type="file" accept="image/*" className={inputClass} />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="visible" defaultChecked={g.visible} />
                  Visible
                </label>
                <button type="submit" className="btn-primary w-full">Save changes</button>
              </form>
              <form action={deleteGalleryImage} className="mt-3 border-t border-line pt-3">
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" className="text-sm text-rose underline">Delete</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
