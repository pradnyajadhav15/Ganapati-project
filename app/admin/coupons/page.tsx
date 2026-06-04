import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/app/admin/coupon-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Coupons" };

type Coupon = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage-deep";

export default async function AdminCouponsPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("coupons")
    .select("id,code,discount_type,discount_value,min_order,max_uses,used_count,active,expires_at")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as Coupon[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">
        Back to products
      </Link>
      <h1 className="mb-2 mt-3 text-3xl">Discount Codes ({items.length})</h1>
      <p className="mb-8 max-w-2xl text-sm text-ink-soft">
        Customers enter these at checkout. Percent codes take a % off; flat codes take a fixed
        rupee amount off. Leave &quot;Max uses&quot; or &quot;Expires&quot; blank for unlimited / no expiry.
      </p>

      <div className="mb-10 rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 text-lg">Create a code</h2>
        <form action={createCoupon} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Code
            <input name="code" required className={inputClass + " uppercase"} placeholder="GANESH10" />
          </label>
          <label className="text-sm">
            Type
            <select name="discount_type" defaultValue="percent" className={inputClass}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (rupees)</option>
            </select>
          </label>
          <label className="text-sm">
            Value (% or rupees)
            <input name="discount_value" type="number" min="0" step="1" required className={inputClass} placeholder="10" />
          </label>
          <label className="text-sm">
            Minimum order (rupees)
            <input name="min_order" type="number" min="0" step="1" defaultValue={0} className={inputClass} />
          </label>
          <label className="text-sm">
            Max uses (optional)
            <input name="max_uses" type="number" min="1" step="1" className={inputClass} placeholder="Unlimited" />
          </label>
          <label className="text-sm">
            Expires (optional)
            <input name="expires_at" type="date" className={inputClass} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">Create code</button>
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-ink-soft">No codes yet. Create one above.</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl2 border border-line bg-white p-5">
              <form action={updateCoupon} className="grid gap-3 md:grid-cols-3">
                <input type="hidden" name="id" value={c.id} />
                <label className="text-sm">
                  Code
                  <input name="code" defaultValue={c.code} required className={inputClass + " uppercase"} />
                </label>
                <label className="text-sm">
                  Type
                  <select name="discount_type" defaultValue={c.discount_type} className={inputClass}>
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (rupees)</option>
                  </select>
                </label>
                <label className="text-sm">
                  Value
                  <input name="discount_value" type="number" min="0" step="1" defaultValue={c.discount_value} required className={inputClass} />
                </label>
                <label className="text-sm">
                  Minimum order
                  <input name="min_order" type="number" min="0" step="1" defaultValue={c.min_order} className={inputClass} />
                </label>
                <label className="text-sm">
                  Max uses
                  <input name="max_uses" type="number" min="1" step="1" defaultValue={c.max_uses ?? ""} className={inputClass} placeholder="Unlimited" />
                </label>
                <label className="text-sm">
                  Expires
                  <input name="expires_at" type="date" defaultValue={c.expires_at ? c.expires_at.slice(0, 10) : ""} className={inputClass} />
                </label>
                <label className="flex items-center gap-2 text-sm md:col-span-3">
                  <input type="checkbox" name="active" defaultChecked={c.active} />
                  Active - used {c.used_count} time{c.used_count === 1 ? "" : "s"}
                </label>
                <div className="md:col-span-3">
                  <button type="submit" className="btn-primary">Save changes</button>
                </div>
              </form>
              <form action={deleteCoupon} className="mt-3 border-t border-line pt-3">
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="text-sm text-rose underline">
                  Delete this code
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
