import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createPost, deletePost, togglePublished } from "./actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Blog" };
const field = "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default async function AdminBlogPage() {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("id,title,slug,published,created_at")
    .order("created_at", { ascending: false });
  const posts = data ?? [];

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-8 mt-3 text-3xl">Blog ({posts.length})</h1>

      <form action={createPost} className="mb-10 space-y-3 rounded-xl2 border border-line bg-white p-6">
        <h2 className="text-lg">New Post</h2>
        <input name="title" required placeholder="Title" className={field} />
        <input name="excerpt" placeholder="Short summary (optional)" className={field} />
        <textarea name="content" required rows={8} placeholder="Story / content" className={field} />
        <input type="file" name="cover" accept="image/*" />
        <button type="submit" className="btn-primary">Publish Post</button>
      </form>

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-ink-soft">
                {p.published ? "Published" : "Hidden"} · {new Date(p.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <form action={togglePublished}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="published" value={String(p.published)} />
                <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                  {p.published ? "Hide" : "Show"}
                </button>
              </form>
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmSubmitButton confirmMessage="Delete this post?" className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
