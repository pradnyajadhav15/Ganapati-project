"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

// --- Auth ---

export async function login(formData: FormData) {
  const pw = formData.get("password");
  if (pw && pw === process.env.ADMIN_PASSWORD) {
    cookies().set("admin_session", "ok", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/admin/login");
}

// --- Product management ---

export async function createProduct(formData: FormData) {
  const file = formData.get("image") as File | null;
  let image_url: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: upErr } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (upErr) throw new Error("Image upload failed: " + upErr.message);
    image_url = supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabaseAdmin.from("products").insert({
    name: formData.get("name"),
    price: Number(formData.get("price")),
    category: formData.get("category"),
    size: formData.get("size") || null,
    tag: formData.get("tag") || null,
    description: formData.get("description") || null,
    image_url,
    in_stock: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;

  const file = formData.get("image") as File | null;
  let image_url: string | null = null;
  let hasNewImage = false;

  if (file && file.size > 0) {
    hasNewImage = true;
    const ext = file.name.split(".").pop() || "jpg";
    const path = Date.now() + "-" + Math.random().toString(36).slice(2) + "." + ext;
    const bytes = await file.arrayBuffer();
    const { error: upErr } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (upErr) throw new Error("Image upload failed: " + upErr.message);
    image_url = supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  const updates: Record<string, unknown> = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    category: formData.get("category"),
    size: formData.get("size") || null,
    tag: formData.get("tag") || null,
    description: formData.get("description") || null,
  };
  if (hasNewImage) updates.image_url = image_url;

  const { error } = await supabaseAdmin.from("products").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/product/" + id);
  redirect("/admin");
}

// --- Order management ---

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/" + id);
  revalidatePath("/admin/orders");
}