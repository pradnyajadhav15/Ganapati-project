"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createBookingAdvanceLink(
  bookingId: string
): Promise<{ ok: true; shortUrl: string } | { ok: false; error: string }> {
  const { data: b, error } = await supabaseAdmin
    .from("bookings")
    .select("id,product_name,customer_name,phone,token_amount,payment_link")
    .eq("id", bookingId)
    .single();
  if (error || !b) return { ok: false, error: "Booking not found." };

  // Reuse an existing link so repeated clicks do not create duplicates.
  if (b.payment_link) return { ok: true, shortUrl: b.payment_link as string };

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return { ok: false, error: "Razorpay keys are not set on the server." };
  }

  const contact = "+91" + String(b.phone).replace(/\D/g, "").slice(-10);
  const auth = Buffer.from(keyId + ":" + keySecret).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + auth },
    body: JSON.stringify({
      amount: Number(b.token_amount) * 100,
      currency: "INR",
      description: "Advance for " + b.product_name + " - R. Ramesh Arts Studio",
      customer: { name: b.customer_name, contact },
      notify: { sms: true, email: false },
      reminder_enable: true,
      notes: { booking_id: b.id },
    }),
  });

  const link = await res.json();
  if (!res.ok || !link.short_url) {
    console.error("Razorpay payment link failed ->", link);
    return { ok: false, error: "Could not create the payment link. Check your Razorpay keys." };
  }

  await supabaseAdmin
    .from("bookings")
    .update({ payment_link: link.short_url, payment_link_id: link.id })
    .eq("id", b.id);

  revalidatePath("/admin/bookings");
  return { ok: true, shortUrl: link.short_url as string };
}
