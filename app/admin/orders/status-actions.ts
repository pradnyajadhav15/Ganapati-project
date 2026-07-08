"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

async function logEvent(orderId: string, label: string) {
  try {
    await supabaseAdmin.from("order_events").insert({ order_id: orderId, label });
  } catch {}
}

export async function setPaymentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("value") ?? "");
  if (!id || !value) return;
  await supabaseAdmin.from("orders").update({ payment_status: value }).eq("id", id);
  await logEvent(id, "Payment marked " + value);
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin/orders");
}

export async function setProgressStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("value") ?? "");
  if (!id || !value) return;
  const updates: Record<string, unknown> = { progress_status: value };
  if (value === "delivered") {
    const { data: o } = await supabaseAdmin.from("orders").select("payment_method,payment_status").eq("id", id).single();
    if (o && o.payment_method === "cod" && o.payment_status !== "paid") {
      updates.payment_status = "paid";
    }
  }
  await supabaseAdmin.from("orders").update(updates).eq("id", id);
  await logEvent(id, "Progress: " + value.replace(/_/g, " "));
  if (updates.payment_status === "paid") await logEvent(id, "Payment marked paid (COD collected)");
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin/orders");
}

export async function saveOrderNotes(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const notes = String(formData.get("notes") ?? "");
  await supabaseAdmin.from("orders").update({ owner_notes: notes }).eq("id", id);
  revalidatePath("/admin/orders/" + id);
}


export async function refundOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("razorpay_payment_id,payment_method,payment_status,total")
    .eq("id", id)
    .single();

  if (!order || order.payment_method !== "razorpay" || !order.razorpay_payment_id) {
    await logEvent(id, "Refund failed: no online payment found for this order");
    return;
  }
  if (order.payment_status !== "paid") {
    await logEvent(id, "Refund skipped: order is not marked as paid");
    return;
  }

  const amountPaise = Math.round(Number(order.total) * 100);
  const auth = Buffer.from(
    process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET
  ).toString("base64");

  try {
    const res = await fetch(
      "https://api.razorpay.com/v1/payments/" + order.razorpay_payment_id + "/refund",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + auth,
        },
        body: JSON.stringify({ amount: amountPaise }),
      }
    );
    const json = await res.json();

    if (!res.ok) {
      await logEvent(id, "Refund failed: " + (json?.error?.description || "Razorpay error"));
    } else {
      await supabaseAdmin.from("orders").update({ payment_status: "refunded" }).eq("id", id);
      await logEvent(id, "Refunded Rs " + Number(order.total).toLocaleString("en-IN") + " via Razorpay");
    }
  } catch (err) {
    await logEvent(id, "Refund failed: could not reach Razorpay");
  }

  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin/orders");
}