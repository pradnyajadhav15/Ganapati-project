"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notifyOwnerOfBooking, notifyCustomerOfBooking } from "@/lib/email";

export async function submitReview(input: {
  productId: string;
  rating: number;
  comment: string;
  name: string;
}): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not-logged-in" };
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { error: "invalid-rating" };
  }

  const name =
    input.name?.trim() ||
    (user.user_metadata?.full_name as string) ||
    "Anonymous";

  const { error } = await supabaseAdmin.from("reviews").upsert(
    {
      product_id: input.productId,
      user_id: user.id,
      customer_name: name,
      rating: input.rating,
      comment: input.comment?.trim() || null,
    },
    { onConflict: "product_id,user_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/product/" + input.productId);
  return { ok: true };
}

export async function createBooking(input: {
  productId: string;
  name: string;
  phone: string;
  notes: string;
}): Promise<{ ok?: boolean; error?: string }> {
  if (!input.name?.trim() || !input.phone?.trim()) {
    return { error: "missing-fields" };
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id,name,price")
    .eq("id", input.productId)
    .single();
  if (!product) return { error: "product-not-found" };

  const total = product.price as number;
  const token = Math.round(total * 0.25);
  const balance = total - token;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      user_id: user?.id ?? null,
      product_id: product.id,
      product_name: product.name,
      customer_name: input.name.trim(),
      phone: input.phone.trim(),
      total_price: total,
      token_amount: token,
      balance_due: balance,
      status: "requested",
      notes: input.notes?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !booking) return { error: error?.message || "Could not save booking." };

  try {
    await notifyOwnerOfBooking(booking.id);
  } catch (e) {
    console.error("Owner booking email failed:", e);
  }
  if (user?.email) {
    try {
      await notifyCustomerOfBooking(booking.id, user.email);
    } catch (e) {
      console.error("Customer booking email failed:", e);
    }
  }

  return { ok: true };
}
