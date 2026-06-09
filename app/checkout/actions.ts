"use server";

import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateReceiptPdf } from "@/lib/receipt";
import { notifyOwnerOfOrder, notifyCustomerOfOrder } from "@/lib/email";
import { validateCoupon } from "@/lib/coupons";
import { getOrderingStatus } from "@/lib/settings";

type PaymentMethod = "razorpay" | "upi" | "cod";

type Input = {
  items: { id: string; qty: number }[];
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deliveryArea: "solapur" | "outside";
  paymentMethod: PaymentMethod;
  couponCode?: string;
};

const SHIPPING_OUTSIDE_IDOL = 500;
const SHIPPING_OUTSIDE_ACCESSORY = 100;

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
  method?: PaymentMethod;
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

  const ordering = await getOrderingStatus();
  if (!ordering.open) {
    return { error: ordering.message || "We are not taking new orders right now. Please pre-book instead." };
  }

  const ids = input.items.map((i) => i.id);
  const [productsRes, accessoriesRes] = await Promise.all([
    supabaseAdmin.from("products").select("id,name,price,size").in("id", ids),
    supabaseAdmin.from("accessories").select("id,name,price").in("id", ids),
  ]);
  if (productsRes.error || accessoriesRes.error) return { error: "Could not load items." };

  const productMap = new Map((productsRes.data ?? []).map((p: any) => [p.id, p]));
  const accessoryMap = new Map((accessoriesRes.data ?? []).map((a: any) => [a.id, a]));
  const orderItems = input.items
    .map((i) => {
      const p: any = productMap.get(i.id);
      if (p) {
        return {
          product_id: p.id as string | null,
          name: p.size ? `${p.name} ${p.size}` : p.name,
          price: p.price as number,
          qty: i.qty,
        };
      }
      const a: any = accessoryMap.get(i.id);
      if (a) {
        return {
          product_id: null as string | null,
          name: a.name as string,
          price: a.price as number,
          qty: i.qty,
        };
      }
      return null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (!orderItems.length) return { error: "No valid items in cart." };

  const capIds = orderItems.map((i) => i.product_id).filter((x): x is string => !!x);
  if (capIds.length) {
    const [capsRes, bookedRes] = await Promise.all([
      supabaseAdmin.from("products").select("id,name,season_capacity").in("id", capIds),
      supabaseAdmin.from("product_booked").select("product_id,booked").in("product_id", capIds),
    ]);
    const capMap = new Map((capsRes.data ?? []).map((p: any) => [p.id, p]));
    const bookedMap = new Map((bookedRes.data ?? []).map((b: any) => [b.product_id, b.booked as number]));
    for (const it of orderItems) {
      if (!it.product_id) continue;
      const cp: any = capMap.get(it.product_id);
      if (cp && cp.season_capacity != null) {
        const remaining = (cp.season_capacity as number) - (bookedMap.get(it.product_id) ?? 0);
        if (it.qty > remaining) {
          return { error: remaining <= 0 ? cp.name + " is sold out for this season." : "Only " + remaining + " of " + cp.name + " left this season." };
        }
      }
    }
  }

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  let discount = 0;
  let couponCode: string | null = null;
  if (input.couponCode && input.couponCode.trim()) {
    const res = await validateCoupon(input.couponCode, subtotal);
    if (!res.valid) return { error: res.message };
    discount = res.discount;
    couponCode = res.code;
  }

  const hasIdol = orderItems.some((i) => i.product_id != null);
  const shipping = input.deliveryArea === "outside" ? (hasIdol ? SHIPPING_OUTSIDE_IDOL : SHIPPING_OUTSIDE_ACCESSORY) : 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: input.name,
      email: input.email || null,
      phone: input.phone,
      address: input.address,
      city: input.city || null,
      state: input.state || null,
      pincode: input.pincode || null,
      delivery_area: input.deliveryArea,
      shipping,
      payment_method: input.paymentMethod,
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

  // ONLINE (Razorpay): create a payment order and hand it back to the browser.
  if (input.paymentMethod === "razorpay") {
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
      method: "razorpay",
      razorpayOrderId: rzpOrder.id,
      amount: finalTotal * 100,
      keyId: process.env.RAZORPAY_KEY_ID!,
    };
  }

  // UPI QR or Cash on Delivery: order is placed as pending. Notify owner + count coupon now.
  try {
    await supabaseAdmin.rpc("assign_invoice_no", { p_order_id: order.id });
  } catch (e) {
    console.error("assign_invoice_no (cod/upi) failed:", e);
  }
  try {
    await notifyOwnerOfOrder(order.id);
  } catch (e) {
    console.error("Owner notification failed:", e);
  }
  if (couponCode) {
    try {
      const { data: c } = await supabaseAdmin
        .from("coupons").select("id,used_count").ilike("code", couponCode).maybeSingle();
      if (c) {
        await supabaseAdmin
          .from("coupons").update({ used_count: (c.used_count ?? 0) + 1 }).eq("id", c.id);
      }
    } catch (e) {
      console.error("Coupon usage increment failed:", e);
    }
  }

  return { orderId: order.id, method: input.paymentMethod };
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
    .update({ status: "paid", payment_status: "paid", razorpay_payment_id: input.razorpay_payment_id })
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
    .select("id,customer_name,phone,address,email,city,state,pincode,subtotal,discount,coupon_code,shipping,total,razorpay_payment_id,invoice_no,created_at")
    .eq("id", orderId)
    .single();
  if (oErr || !order) throw new Error(oErr?.message || "Order not found");

  const { data: items, error: iErr } = await supabaseAdmin
    .from("order_items")
    .select("name,price,qty")
    .eq("order_id", orderId);
  if (iErr) throw new Error(iErr.message);

  let invoiceNo: string | null = (order as any).invoice_no ?? null;
  try {
    const { data: assigned } = await supabaseAdmin.rpc("assign_invoice_no", { p_order_id: orderId });
    if (assigned) invoiceNo = assigned as string;
  } catch (e) {
    console.error("assign_invoice_no failed:", e);
  }
  const bytes = await generateReceiptPdf({ ...order, invoice_no: invoiceNo } as any, items ?? []);

  const path = `${orderId}.pdf`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("receipts")
    .upload(path, bytes, { contentType: "application/pdf", upsert: true, cacheControl: "0" });
  if (upErr) throw new Error(upErr.message);

  const url = supabaseAdmin.storage.from("receipts").getPublicUrl(path).data.publicUrl + "?v=" + Date.now();

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
