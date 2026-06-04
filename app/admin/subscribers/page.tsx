import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SubscriberExport from "@/components/SubscriberExport";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Subscribers" };

type Sub = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

function waLink(phone: string) {
  return "https://wa.me/91" + phone.replace(/\D/g, "").slice(-10);
}

export default async function AdminSubscribersPage() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("subscribers")
    .select("id,name,email,phone,created_at")
    .order("created_at", { ascending: false });

  const subscribers = (data ?? []) as Sub[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-2 mt-3 text-3xl">Subscribers ({subscribers.length})</h1>
      <p className="mb-6 text-ink-soft">People who signed up for season updates.</p>

      <div className="mb-6">
        <SubscriberExport subscribers={subscribers} />
      </div>

      {subscribers.length === 0 ? (
        <p className="text-ink-soft">No subscribers yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-deep text-ink-soft">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="p-4">{s.name || "-"}</td>
                  <td className="p-4">{s.email || "-"}</td>
                  <td className="p-4">
                    {s.phone ? (
                      <a href={waLink(s.phone)} target="_blank" rel="noreferrer" className="text-sage-deep underline">{s.phone}</a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-ink-soft">{new Date(s.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
