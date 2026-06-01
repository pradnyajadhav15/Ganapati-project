import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatINR } from "@/lib/format";
import { signOut } from "../auth/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (user.user_metadata?.full_name as string) || "there";

  const { data: orders } = await supabase
    .from("orders")
    .select("id,total,status,created_at,receipt_url")
    .order("created_at", { ascending: false });

  return (
    <section className="site-wrap py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">Hello, {name}</h1>
          <p className="mt-2 text-ink-soft">Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <button className="btn-ghost">Log out</button>
        </form>
      </div>

      <h2 className="mb-4 mt-10 text-2xl">Your Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="overflow-hidden rounded-xl2 border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-deep text-ink-soft">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="p-4 font-medium">#{String(o.id).slice(0, 8)}</td>
                  <td className="p-4 text-ink-soft">{new Date(o.created_at as string).toLocaleDateString("en-IN")}</td>
                  <td className="p-4"><span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs capitalize text-sage-deep">{o.status}</span></td>
                  <td className="p-4">{formatINR(o.total as number)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/order-success?id=${o.id}`} className="text-sage-deep underline">View</Link>
                      {o.receipt_url && (<a href={o.receipt_url as string} target="_blank" rel="noreferrer" className="text-sage-deep underline">Receipt</a>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl2 border border-line bg-white p-8 text-center text-ink-soft">No orders yet. Browse the collections to place your first order.</p>
      )}
    </section>
  );
}