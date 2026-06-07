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

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error: upErr } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (upErr) throw new Error("Image upload failed: " + upErr.message);
  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function createProduct(formData: FormData) {
  const file = formData.get("image") as File | null;
  let image_url: string | null = null;
  if (file && file.size > 0) {
    image_url = await uploadImage(file);
  }

  const extraFiles = (formData.getAll("images") as File[]).filter((f) => f && f.size > 0);
  const image_urls: string[] = [];
  for (const f of extraFiles) {
    image_urls.push(await uploadImage(f));
  }

  const { error } = await supabaseAdmin.from("products").insert({
    name: formData.get("name"),
    name_hi: formData.get("name_hi") || null,
    name_mr: formData.get("name_mr") || null,
    price: Number(formData.get("price")),
    category: formData.get("category"),
    size: formData.get("size") || null,
    tag: formData.get("tag") || null,
    description: formData.get("description") || null,
    description_hi: formData.get("description_hi") || null,
    description_mr: formData.get("description_mr") || null,
    image_url,
    image_urls,
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
  let hasNewImage = false;
  let image_url: string | null = null;
  if (file && file.size > 0) {
    hasNewImage = true;
    image_url = await uploadImage(file);
  }

  const updates: Record<string, unknown> = {
    name: formData.get("name"),
    name_hi: formData.get("name_hi") || null,
    name_mr: formData.get("name_mr") || null,
    price: Number(formData.get("price")),
    category: formData.get("category"),
    size: formData.get("size") || null,
    tag: formData.get("tag") || null,
    description: formData.get("description") || null,
    description_hi: formData.get("description_hi") || null,
    description_mr: formData.get("description_mr") || null,
  };
  if (hasNewImage) updates.image_url = image_url;
  updates.in_stock = formData.get("in_stock") === "on";
  const capRaw = formData.get("season_capacity");
  updates.season_capacity = capRaw === null || String(capRaw).trim() === "" ? null : Number(capRaw);

  const clearExtra = formData.get("clear_images") === "on";
  const extraFiles = (formData.getAll("images") as File[]).filter((f) => f && f.size > 0);
  if (clearExtra || extraFiles.length) {
    let gallery: string[] = [];
    if (!clearExtra) {
      const { data: existing } = await supabaseAdmin
        .from("products")
        .select("image_urls")
        .eq("id", id)
        .single();
      gallery = (existing?.image_urls as string[]) ?? [];
    }
    for (const f of extraFiles) {
      gallery.push(await uploadImage(f));
    }
    updates.image_urls = gallery;
  }

  const { error } = await supabaseAdmin.from("products").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/product/" + id);
  redirect("/admin");
}

export async function setOrderingStatus(formData: FormData) {
  const ordering_open = formData.get("ordering_open") === "on";
  const cutoffRaw = formData.get("order_cutoff");
  const order_cutoff = cutoffRaw && String(cutoffRaw).trim() !== "" ? String(cutoffRaw) : null;
  const msgRaw = formData.get("closed_message");
  const closed_message = msgRaw && String(msgRaw).trim() !== "" ? String(msgRaw).trim() : null;

  const { error } = await supabaseAdmin
    .from("site_settings")
    .update({ ordering_open, order_cutoff, closed_message })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
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

// --- Booking management ---

export async function updateBookingStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/bookings");
}
