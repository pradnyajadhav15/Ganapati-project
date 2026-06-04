"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

function requireAdmin() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }
}

async function uploadGalleryImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed: " + error.message);
  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function createGalleryImage(formData: FormData) {
  requireAdmin();
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) throw new Error("Please choose an image.");
  const image_url = await uploadGalleryImage(file);
  const caption = String(formData.get("caption") || "").trim() || null;
  const sort_order = Number(formData.get("sort_order") || 0);

  const { error } = await supabaseAdmin.from("gallery").insert({
    image_url,
    caption,
    sort_order,
    visible: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/our-work");
}

export async function updateGalleryImage(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const updates: Record<string, unknown> = {
    caption: String(formData.get("caption") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
    visible: formData.get("visible") === "on",
  };

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    updates.image_url = await uploadGalleryImage(file);
  }

  const { error } = await supabaseAdmin.from("gallery").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/our-work");
}

export async function deleteGalleryImage(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabaseAdmin.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/our-work");
}
