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

export async function notifyCustomerOfOrder(orderId: string, customerEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !customerEmail) {
    console.warn("Customer email skipped: no API key or customer email.");
    return;
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,total,receipt_url")
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

  const shortId = String(order.id).slice(0, 8).toUpperCase();

  const text =
    "Namaste " + (order.customer_name || "") + ",\n\n" +
    "Thank you for your order with R. Ramesh Arts Studio. Your payment has been received and your order is confirmed.\n\n" +
    "Order #" + shortId + "\n\n" +
    "Items:\n" + lines.join("\n") + "\n\n" +
    "Total: Rs " + order.total + "\n\n" +
    (order.receipt_url ? "Download your receipt: " + order.receipt_url + "\n\n" : "") +
    "We will be in touch about delivery. For any questions, reply to this email or message us on WhatsApp at +91 70202 90393.\n\n" +
    "Vighnaharta bless you!\n" +
    "R. Ramesh Arts Studio, Solapur";

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "R. Ramesh Arts <onboarding@resend.dev>",
    to: [customerEmail],
    subject: "Order Confirmed - #" + shortId + " - R. Ramesh Arts Studio",
    text: text,
  });
}

export async function notifyOwnerOfContact(input: {
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) {
    console.warn("Contact email skipped: RESEND_API_KEY or OWNER_EMAIL not set.");
    return { ok: false };
  }

  const text =
    "New enquiry from the website contact form.\n\n" +
    "Name: " + input.name + "\n" +
    "Email: " + input.email + "\n\n" +
    "Message:\n" + input.message;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "R. Ramesh Arts <onboarding@resend.dev>",
      to: [to],
      subject: "New enquiry from " + input.name,
      text: text,
    });
    return { ok: true };
  } catch (e) {
    console.error("Contact email failed:", e);
    return { ok: false };
  }
}

export async function notifyOwnerOfBooking(bookingId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) {
    console.warn("Booking email skipped: RESEND_API_KEY or OWNER_EMAIL not set.");
    return;
  }

  const { data: b } = await supabaseAdmin
    .from("bookings")
    .select("id,product_name,customer_name,phone,total_price,token_amount,balance_due,notes")
    .eq("id", bookingId)
    .single();
  if (!b) return;

  const text =
    "New season pre-booking request.\n\n" +
    "Idol: " + b.product_name + "\n" +
    "Customer: " + b.customer_name + "\n" +
    "Phone: " + b.phone + "\n" +
    "Full price: Rs " + b.total_price + "\n" +
    "Suggested advance (25%): Rs " + b.token_amount + "\n" +
    "Balance on delivery: Rs " + b.balance_due + "\n" +
    (b.notes ? "\nCustomer notes:\n" + b.notes + "\n" : "") +
    "\nFollow up with the customer to confirm and collect the advance.";

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "R. Ramesh Arts <onboarding@resend.dev>",
    to: [to],
    subject: "New Pre-booking - " + b.product_name + " from " + b.customer_name,
    text: text,
  });
}

export async function notifyCustomerOfBooking(bookingId: string, customerEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !customerEmail) {
    console.warn("Customer booking email skipped: no API key or email.");
    return;
  }

  const { data: b } = await supabaseAdmin
    .from("bookings")
    .select("product_name,customer_name,total_price,token_amount,balance_due")
    .eq("id", bookingId)
    .single();
  if (!b) return;

  const text =
    "Namaste " + (b.customer_name || "") + ",\n\n" +
    "Thank you for your pre-booking request with R. Ramesh Arts Studio.\n\n" +
    "Idol: " + b.product_name + "\n" +
    "Full price: Rs " + b.total_price + "\n" +
    "Advance to reserve (25%): Rs " + b.token_amount + "\n" +
    "Balance on delivery: Rs " + b.balance_due + "\n\n" +
    "We will contact you shortly to confirm the details and share advance payment options. You can also reach us on WhatsApp at +91 70202 90393.\n\n" +
    "Vighnaharta bless you!\n" +
    "R. Ramesh Arts Studio, Solapur";

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "R. Ramesh Arts <onboarding@resend.dev>",
    to: [customerEmail],
    subject: "Pre-booking Received - " + b.product_name + " - R. Ramesh Arts Studio",
    text: text,
  });
}
