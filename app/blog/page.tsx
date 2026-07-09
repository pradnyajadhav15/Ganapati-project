import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Our Stories - R. Ramesh Arts Studio" };

export default async function BlogListPage() {
  const { data } = await supabase
    .from("blog_posts")
    .select("title,slug,excerpt,cover_image,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  const posts = data ?? [];

  return (
    <section className="site-wrap py-16">
      <h1 className="mb-10 text-center text-3xl">Our Stories</h1>
      <div className="mx-auto grid max-w-3xl gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={"/blog/" + p.slug} className="rounded-xl2 border border-line bg-white p-6 shadow-soft transition hover:shadow-md">
            {p.cover_image && <img src={p.cover_image} alt={p.title} className="mb-4 h-48 w-full rounded-xl object-cover" />}
            <h2 className="text-xl">{p.title}</h2>
            {p.excerpt && <p className="mt-2 text-ink-soft">{p.excerpt}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="text-center text-ink-soft">No stories yet.</p>}
      </div>
    </section>
  );
}
