"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

import { uploadCompressedImage } from "@/lib/image-upload";
async function uploadCover(file: File): Promise<string> {
  return uploadCompressedImage(file, "blog-");
}

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  if (!title || !content) return;

  let cover_image: string | null = null;
  const file = formData.get("cover") as File | null;
  if (file && file.size > 0) cover_image = await uploadCover(file);

  const slug = slugify(title) + "-" + Date.now().toString(36);

  const { error } = await supabaseAdmin.from("blog_posts").insert({
    title, slug, content, excerpt: excerpt || null, cover_image, published: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id"));
  await supabaseAdmin.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePublished(formData: FormData) {
  const id = String(formData.get("id"));
  const published = formData.get("published") === "true";
  await supabaseAdmin.from("blog_posts").update({ published: !published }).eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
