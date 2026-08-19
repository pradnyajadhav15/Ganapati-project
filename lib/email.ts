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
    from: "R. Ramesh Arts <orders@rramesharts.com>",
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
    from: "R. Ramesh Arts <orders@rramesharts.com>",
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
      from: "R. Ramesh Arts <orders@rramesharts.com>",
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
    from: "R. Ramesh Arts <orders@rramesharts.com>",
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
    from: "R. Ramesh Arts <orders@rramesharts.com>",
    to: [customerEmail],
    subject: "Pre-booking Received - " + b.product_name + " - R. Ramesh Arts Studio",
    text: text,
  });
}


export async function notifyOwnerOfSoldOut(productName: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) return { ok: false };

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "R. Ramesh Arts <orders@rramesharts.com>",
      to: [to],
      subject: "Marked Sold Out: " + productName,
      text: "You just marked \"" + productName + "\" as Sold Out. Update stock when restocked.",
    });
    return { ok: true };
  } catch (e) {
    console.error("Sold-out email failed:", e);
    return { ok: false };
  }
}
/**
 * Sends a password reset link that points at our own domain.
 *
 * Supabase's own recovery mail routes the user through its /verify endpoint,
 * which then redirects to whatever the project's Site URL / redirect allow
 * list resolves to — a setting this app cannot control from code. Minting the
 * token here and building the link ourselves keeps the destination under our
 * control, so the flow cannot be redirected somewhere unexpected.
 *
 * Returns false when Resend is not configured, so the caller can fall back to
 * Supabase's mailer rather than silently sending nothing.
 */
export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Password reset email skipped: RESEND_API_KEY not set.");
    return false;
  }

  const from =
    process.env.AUTH_EMAIL_FROM || "R. Ramesh Arts <orders@rramesharts.com>";

  const text =
    "Namaskar,\n\n" +
    "We received a request to reset the password for your R. Ramesh Arts Studio account.\n\n" +
    "Open this link to choose a new password:\n" +
    input.resetUrl +
    "\n\nThe link can be used once and expires shortly.\n" +
    "If you did not ask for this, you can ignore this email — your password stays unchanged.\n\n" +
    "R. Ramesh Arts Studio, Solapur";

  const html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#33291F">' +
    '<h1 style="font-size:20px;margin:0 0 16px">Reset your password</h1>' +
    '<p style="margin:0 0 16px;line-height:1.6">We received a request to reset the password for your R. Ramesh Arts Studio account.</p>' +
    '<p style="margin:0 0 28px"><a href="' +
    input.resetUrl +
    '" style="display:inline-block;background:#33291F;color:#FBF6EE;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">Choose a new password</a></p>' +
    '<p style="margin:0 0 16px;font-size:13px;color:#6B5D4F;line-height:1.6">The link can be used once and expires shortly. If you did not ask for this, ignore this email — your password stays unchanged.</p>' +
    '<p style="margin:24px 0 0;font-size:12px;color:#6B5D4F">R. Ramesh Arts Studio, Solapur</p>' +
    "</div>";

  try {
    const resend = new Resend(apiKey);
    // The SDK resolves with { data, error } and only throws on transport
    // failures, so the error field has to be checked explicitly. Missing it
    // would report success for a mail that was never accepted, and the caller
    // would skip its fallback — leaving the customer with no email at all.
    const { data, error } = await resend.emails.send({
      from,
      to: [input.to],
      subject: "Reset your R. Ramesh Arts Studio password",
      text,
      html,
    });

    if (error) {
      console.error(
        "Password reset email rejected by Resend:",
        error.name,
        error.statusCode,
        error.message,
        "(from: " + from + ")"
      );
      return false;
    }

    if (!data?.id) {
      console.error("Password reset email returned no id; treating as failed.");
      return false;
    }

    return true;
  } catch (err) {
    console.error("Password reset email failed to send:", err);
    return false;
  }
}
