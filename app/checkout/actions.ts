"use server";

import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateReceiptPdf } from "@/lib/receipt";
import { notifyOwnerOfOrder, notifyCustomerOfOrder } from "@/lib/email";
import { validateCoupon } from "@/lib/coupons";

type Input = {
  items: { id: string; qty: number }[];
  name: string;
  phone: string;
  address: string;
  couponCode?: string;
};

export async function previewCoupon(input: {
  items: { id: string; qty: number }[];
  code: string;
}): Promise<{ valid: boolean; discount: number; subtotal: number; total: number; message: string }> {
  const ids = input.items.map((i) => i.id);
  const { data: products } = await supabaseAdmin
    .from("products").select("id,price").in("id", ids);
  const map = new Map((products ?? []).map((p) => [p.id, p.price as number]));
  const subtotal = input.items.reduce((s, i) => s + (map.get(i.id) ?? 0) * i.qty, 0);
  const res = await validateCoupon(input.code, subtotal);
  if (!res.valid) return { valid: false, discount: 0, subtotal, total: subtotal, message: res.message };
  return { valid: true, discount: res.discount, subtotal, total: subtotal - res.discount, message: res.message };
}

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

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  let discount = 0;
  let couponCode: string | null = null;
  if (input.couponCode && input.couponCode.trim()) {
    const res = await validateCoupon(input.couponCode, subtotal);
    if (!res.valid) return { error: res.message };
    discount = res.discount;
    couponCode = res.code;
  }
  const finalTotal = Math.max(0, subtotal - discount);

  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: input.name,
      phone: input.phone,
      address: input.address,
      subtotal,
      discount,
      coupon_code: couponCode,
      total: finalTotal,
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
    body: JSON.stringify({ amount: finalTotal * 100, currency: "INR", receipt: order.id }),
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
    amount: finalTotal * 100,
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

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid", razorpay_payment_id: input.razorpay_payment_id })
    .eq("id", input.orderId)
    .eq("razorpay_order_id", input.razorpay_order_id);
  if (error) return { error: error.message };

  try {
    await buildAndSaveReceipt(input.orderId);
  } catch (e) {
    console.error("Receipt generation failed:", e);
  }

  try {
    await notifyOwnerOfOrder(input.orderId);
  } catch (e) {
    console.error("Order notification email failed:", e);
  }

  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await notifyCustomerOfOrder(input.orderId, user.email);
    }
  } catch (e) {
    console.error("Customer confirmation email failed:", e);
  }

  try {
    const { data: ord } = await supabaseAdmin
      .from("orders").select("coupon_code").eq("id", input.orderId).single();
    if (ord?.coupon_code) {
      const { data: c } = await supabaseAdmin
        .from("coupons").select("id,used_count").ilike("code", ord.coupon_code).maybeSingle();
      if (c) {
        await supabaseAdmin
          .from("coupons").update({ used_count: (c.used_count ?? 0) + 1 }).eq("id", c.id);
      }
    }
  } catch (e) {
    console.error("Coupon usage increment failed:", e);
  }

  return { ok: true };
}

async function buildAndSaveReceipt(orderId: string) {
  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,address,subtotal,discount,coupon_code,total,razorpay_payment_id,created_at")
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

export async function regenerateReceipt(orderId: string): Promise<{ error?: string; ok?: boolean }> {
  try {
    await buildAndSaveReceipt(orderId);
    return { ok: true };
  } catch (e) {
    console.error("regenerateReceipt failed ->", e);
    return { error: e instanceof Error ? e.message : "Failed" };
  }
}
