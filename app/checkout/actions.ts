"use server";

import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateReceiptPdf } from "@/lib/receipt";
import { notifyOwnerOfOrder } from "@/lib/email";

type Input = {
  items: { id: string; qty: number }[];
  name: string;
  phone: string;
  address: string;
};

export async function placeOrder(input: Input): Promise<{
  error?: string;
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  keyId?: string;
}> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in to place your order." };
  if (!input.items.length) return { error: "Your cart is empty." };

  const ids = input.items.map((i) => i.id);
  const { data: products, error: pErr } = await supabaseAdmin
    .from("products").select("id,name,price,size").in("id", ids);
  if (pErr || !products) return { error: "Could not load products." };

  const map = new Map(products.map((p) => [p.id, p]));
  const orderItems = input.items
    .filter((i) => map.has(i.id))
    .map((i) => {
      const p = map.get(i.id)!;
      return {
        product_id: p.id,
        name: p.size ? `${p.name} ${p.size}` : p.name,
        price: p.price as number,
        qty: i.qty,
      };
    });
  if (!orderItems.length) return { error: "No valid products in cart." };

  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: input.name,
      phone: input.phone,
      address: input.address,
      total,
      status: "pending",
    })
    .select("id")
    .single();
  if (oErr || !order) return { error: oErr?.message || "Could not create order." };

  await supabaseAdmin
    .from("order_items")
    .insert(orderItems.map((oi) => ({ ...oi, order_id: order.id })));

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");
  const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: total * 100, currency: "INR", receipt: order.id }),
  });
  const rzpOrder = await rzpRes.json();
  if (!rzpRes.ok || !rzpOrder.id) {
    return { error: "Could not start payment. Check your Razorpay keys." };
  }

  await supabaseAdmin
    .from("orders")
    .update({ razorpay_order_id: rzpOrder.id })
    .eq("id", order.id);

  return {
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: total * 100,
    keyId: process.env.RAZORPAY_KEY_ID!,
  };
}

export async function verifyPayment(input: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok?: boolean; error?: string }> {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
    .digest("hex");

  if (expected !== input.razorpay_signature) {
    return { error: "Payment verification failed." };
  }

  // 1) Mark order as paid first so we don't lose the paid state if PDF gen fails.
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid", razorpay_payment_id: input.razorpay_payment_id })
    .eq("id", input.orderId)
    .eq("razorpay_order_id", input.razorpay_order_id);
  if (error) return { error: error.message };

  // 2) Generate and upload the receipt PDF. Failures here don't block "ok".
  try {
    await buildAndSaveReceipt(input.orderId);
  } catch (e) {
    console.error("Receipt generation failed:", e);
  }

  // 3) Email the owner about the new paid order.
  try {
    await notifyOwnerOfOrder(input.orderId);
  } catch (e) {
    console.error("Order notification email failed:", e);
  }

  return { ok: true };
}

async function buildAndSaveReceipt(orderId: string) {
  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,address,total,razorpay_payment_id,created_at")
    .eq("id", orderId)
    .single();
  if (oErr || !order) throw new Error(oErr?.message || "Order not found");

  const { data: items, error: iErr } = await supabaseAdmin
    .from("order_items")
    .select("name,price,qty")
    .eq("order_id", orderId);
  if (iErr) throw new Error(iErr.message);

  const bytes = await generateReceiptPdf(order, items ?? []);

  const path = `${orderId}.pdf`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("receipts")
    .upload(path, bytes, { contentType: "application/pdf", upsert: true });
  if (upErr) throw new Error(upErr.message);

  const url = supabaseAdmin.storage.from("receipts").getPublicUrl(path).data.publicUrl;

  await supabaseAdmin.from("orders").update({ receipt_url: url }).eq("id", orderId);
}

// Admin-only — called from the order detail page to (re)generate a missing or stale receipt.
export async function regenerateReceipt(orderId: string): Promise<{ error?: string; ok?: boolean }> {
  try {
    await buildAndSaveReceipt(orderId);
    return { ok: true };
  } catch (e) {
    console.error("regenerateReceipt failed ->", e); return { error: e instanceof Error ? e.message : "Failed" };
  }
}