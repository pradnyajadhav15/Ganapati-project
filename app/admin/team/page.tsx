import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { addTeamMember, updateTeamMember, deleteTeamMember } from "@/app/admin/team-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Team" };

type Member = { id: string; name: string; role: string | null; sort_order: number };

export default async function AdminTeamPage() {
  if (cookies().get("admin_session")?.value !== "ok") redirect("/admin/login");

  const { data } = await supabaseAdmin
    .from("team_members")
    .select("id,name,role,sort_order")
    .order("sort_order", { ascending: true });
  const members = (data ?? []) as Member[];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-8 mt-3 text-3xl">Team members ({members.length})</h1>

      <form action={addTeamMember} className="mb-10 rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 text-lg">Add a member</h2>
        <div className="grid gap-3 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end">
          <label className="block text-sm"><span className="text-ink-soft">Name</span><input name="name" required className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
          <label className="block text-sm"><span className="text-ink-soft">Role (optional)</span><input name="role" placeholder="e.g. Master Artisan" className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
          <label className="block text-sm"><span className="text-ink-soft">Order</span><input name="sort_order" type="number" defaultValue={members.length + 1} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
          <button type="submit" className="rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-cream">Add</button>
        </div>
      </form>

      <h2 className="mb-4 text-lg">Edit members</h2>
      {members.length === 0 ? (
        <p className="text-ink-soft">No team members yet.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex flex-wrap items-end gap-3 rounded-xl2 border border-line bg-white p-4">
              <form action={updateTeamMember} className="grid flex-1 gap-3 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end">
                <input type="hidden" name="id" value={m.id} />
                <label className="block text-sm"><span className="text-ink-soft">Name</span><input name="name" defaultValue={m.name} required className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
                <label className="block text-sm"><span className="text-ink-soft">Role</span><input name="role" defaultValue={m.role ?? ""} placeholder="Artisan" className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
                <label className="block text-sm"><span className="text-ink-soft">Order</span><input name="sort_order" type="number" defaultValue={m.sort_order} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2" /></label>
                <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-cream">Save</button>
              </form>
              <form action={deleteTeamMember}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600">Remove</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
