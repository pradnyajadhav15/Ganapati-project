"use client";

import { useState } from "react";
import { createBookingAdvanceLink } from "@/app/admin/bookings/advance-actions";

export default function BookingAdvanceButton({
  bookingId,
  phone,
  customerName,
  productName,
  tokenAmount,
  balanceDue,
  existingLink,
}: {
  bookingId: string;
  phone: string;
  customerName: string;
  productName: string;
  tokenAmount: number;
  balanceDue: number;
  existingLink: string | null;
}) {
  const [link, setLink] = useState<string | null>(existingLink);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const waNumber = "91" + phone.replace(/\D/g, "").slice(-10);

  function waHref(l: string) {
    const msg =
      "\u0928\u092e\u0938\u094d\u0915\u093e\u0930 " + customerName + " \uD83D\uDE4F\n" +
      "Thank you for pre-booking *" + productName + "* with R. Ramesh Arts Studio.\n\n" +
      "To confirm your order, please pay the advance of \u20B9" +
      tokenAmount.toLocaleString("en-IN") + " here:\n" + l + "\n\n" +
      "Balance \u20B9" + balanceDue.toLocaleString("en-IN") + " is payable on delivery.\n" +
      "Dhanyawad! \uD83D\uDE4F";
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg);
  }

  async function create() {
    setErr("");
    setLoading(true);
    try {
      const r = await createBookingAdvanceLink(bookingId);
      if (r.ok) setLink(r.shortUrl);
      else setErr(r.error);
    } catch {
      setErr("Something went wrong creating the link.");
    } finally {
      setLoading(false);
    }
  }

  if (!link) {
    return (
      <div className="flex flex-col items-start gap-1">
        <button onClick={create} disabled={loading} className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-cream disabled:opacity-60">{loading ? "Creating link..." : "Create advance-payment link"}</button>
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <a href={waHref(link)} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white">Send advance link on WhatsApp</a>
      <a href={link} target="_blank" rel="noreferrer" className="text-xs text-sage-deep underline break-all">{link}</a>
    </div>
  );
}
