import "server-only";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function notifyOwnerOfOrder(orderId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) {
    console.warn("Order email skipped: RESEND_API_KEY or OWNER_EMAIL not set.");
    return;
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,address,total,razorpay_payment_id")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("name,price,qty")
    .eq("order_id", orderId);

  const lines = (items ?? []).map(
    (i) => i.qty + " x " + i.name + " - Rs " + i.price * i.qty
  );

  const text =
    "New paid order received.\n\n" +
    "Order ID: " + order.id + "\n" +
    "Customer: " + order.customer_name + "\n" +
    "Phone: " + order.phone + "\n" +
    "Address: " + order.address + "\n" +
    (order.razorpay_payment_id ? "Payment ID: " + order.razorpay_payment_id + "\n" : "") +
    "\nItems:\n" + lines.join("\n") + "\n\n" +
    "Total: Rs " + order.total;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "R. Ramesh Arts <onboarding@resend.dev>",
    to: [to],
    subject: "New Order - Rs " + order.total + " from " + order.customer_name,
    text: text,
  });
}