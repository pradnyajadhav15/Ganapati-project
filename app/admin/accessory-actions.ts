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

async function uploadAccessoryImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `accessories/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed: " + error.message);
  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function createAccessory(formData: FormData) {
  requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required");
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const price = Number(formData.get("price") || 0);
  const sort_order = Number(formData.get("sort_order") || 0);

  const file = formData.get("image") as File | null;
  let image_url: string | null = null;
  if (file && file.size > 0) {
    image_url = await uploadAccessoryImage(file);
  }

  const { error } = await supabaseAdmin.from("accessories").insert({
    name,
    subtitle,
    price,
    sort_order,
    image_url,
    visible: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accessories");
  revalidatePath("/");
}

export async function updateAccessory(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const updates: Record<string, unknown> = {
    name: String(formData.get("name") || "").trim(),
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    price: Number(formData.get("price") || 0),
    sort_order: Number(formData.get("sort_order") || 0),
    visible: formData.get("visible") === "on",
  };

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    updates.image_url = await uploadAccessoryImage(file);
  }

  const { error } = await supabaseAdmin.from("accessories").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accessories");
  revalidatePath("/");
}

export async function deleteAccessory(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabaseAdmin.from("accessories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/accessories");
  revalidatePath("/");
}
