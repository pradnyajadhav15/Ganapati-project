import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,content,cover_image,created_at")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <section className="site-wrap max-w-2xl py-16">
      <h1 className="text-3xl">{post.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{new Date(post.created_at).toLocaleDateString("en-IN")}</p>
      {post.cover_image && <img src={post.cover_image} alt={post.title} className="my-6 w-full rounded-xl2 object-cover" />}
      <div className="whitespace-pre-wrap leading-relaxed text-ink">{post.content}</div>
    </section>
  );
}
