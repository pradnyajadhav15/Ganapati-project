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

async function uploadTestimonialImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed: " + error.message);
  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function createTestimonial(formData: FormData) {
  requireAdmin();
  const quote = String(formData.get("quote") || "").trim();
  if (!quote) throw new Error("Quote is required");
  const customer_name = String(formData.get("customer_name") || "").trim();
  if (!customer_name) throw new Error("Name is required");
  const city = String(formData.get("city") || "").trim() || null;
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") || 5)));
  const sort_order = Number(formData.get("sort_order") || 0);

  const file = formData.get("image") as File | null;
  let image_url: string | null = null;
  if (file && file.size > 0) {
    image_url = await uploadTestimonialImage(file);
  }

  const { error } = await supabaseAdmin.from("testimonials").insert({
    quote,
    customer_name,
    city,
    rating,
    sort_order,
    image_url,
    visible: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const updates: Record<string, unknown> = {
    quote: String(formData.get("quote") || "").trim(),
    customer_name: String(formData.get("customer_name") || "").trim(),
    city: String(formData.get("city") || "").trim() || null,
    rating: Math.max(1, Math.min(5, Number(formData.get("rating") || 5))),
    sort_order: Number(formData.get("sort_order") || 0),
    visible: formData.get("visible") === "on",
  };

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    updates.image_url = await uploadTestimonialImage(file);
  }

  const { error } = await supabaseAdmin.from("testimonials").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
