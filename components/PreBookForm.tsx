"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { createBooking } from "@/app/product/actions";

const field = "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function PreBookForm({
  productId,
  productName,
  price,
  defaultName,
}: {
  productId: string;
  productName: string;
  price: number;
  defaultName: string;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const token = Math.round(price * 0.25);
  const waText = encodeURIComponent("Hi, I'd like to pre-book the " + productName + " for the season.");
  const waHref = "https://wa.me/917020290393?text=" + waText;

  async function submit() {
    if (!name.trim() || !phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await createBooking({ productId, name, phone, notes });
    if (res.ok) setStatus("sent");
    else setStatus("error");
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-xl2 border border-sage bg-sage/5 p-6">
        <p className="font-medium text-sage-deep">{t.bookingThanks}</p>
        <a href={waHref} target="_blank" rel="noreferrer" className="btn-primary mt-4 inline-block">
          {t.continueOnWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl2 border border-line bg-cream-deep p-6">
      <h3 className="text-lg">{t.preBookTitle}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t.preBookIntro}</p>
      <p className="mt-2 text-sm font-medium text-terracotta">
        {t.suggestedAdvance}: {"\u20B9"}{token.toLocaleString("en-IN")} ({t.balanceOnDelivery})
      </p>

      {!open ? (
        <button onClick={() => setOpen(true)} className="btn-primary mt-4">
          {t.preBookbtn}
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <input className={field} placeholder={t.fullName} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={field} placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea className={field} rows={3} placeholder={t.preBookNotes} value={notes} onChange={(e) => setNotes(e.target.value)} />
          {status === "error" && <p className="text-sm text-red-600">{t.bookingError}</p>}
          <button onClick={submit} disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
            {status === "sending" ? t.processing : t.submitPreBook}
          </button>
        </div>
      )}
    </div>
  );
}
