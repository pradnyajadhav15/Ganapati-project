import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateBookingStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Bookings" };

type Booking = {
  id: string;
  product_name: string;
  customer_name: string;
  phone: string;
  total_price: number;
  token_amount: number;
  balance_due: number;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = [
  { value: "requested", label: "Requested" },
  { value: "confirmed", label: "Confirmed" },
  { value: "advance-paid", label: "Advance paid" },
  { value: "fulfilled", label: "Fulfilled / Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function AdminBookingsPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("bookings")
    .select("id,product_name,customer_name,phone,total_price,token_amount,balance_due,status,notes,created_at")
    .order("created_at", { ascending: false });

  const bookings = (data ?? []) as Booking[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-8 mt-3 text-3xl">Pre-bookings ({bookings.length})</h1>

      {bookings.length === 0 ? (
        <p className="text-ink-soft">No pre-bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl2 border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg">{b.product_name}</h3>
                  <p className="text-sm text-ink-soft">
                    {b.customer_name} · <a href={"tel:" + b.phone} className="underline">{b.phone}</a>
                    {" · "}
                    <a href={"https://wa.me/91" + b.phone.replace(/\D/g, "").slice(-10)} target="_blank" rel="noreferrer" className="text-sage-deep underline">WhatsApp</a>
                  </p>
                </div>
                <form action={updateBookingStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={b.id} />
                  <select name="status" defaultValue={b.status} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button type="submit" className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-cream">Update</button>
                </form>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span>Full: <b>Rs {b.total_price.toLocaleString("en-IN")}</b></span>
                <span>Advance: <b>Rs {b.token_amount.toLocaleString("en-IN")}</b></span>
                <span>Balance: <b>Rs {b.balance_due.toLocaleString("en-IN")}</b></span>
              </div>

              {b.notes && (
                <p className="mt-2 rounded-lg bg-cream-deep p-3 text-sm text-ink-soft">{b.notes}</p>
              )}

              <p className="mt-2 text-xs text-ink-soft/60">
                {new Date(b.created_at).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
