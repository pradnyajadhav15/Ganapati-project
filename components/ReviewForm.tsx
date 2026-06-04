"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { submitReview } from "@/app/product/actions";

const field =
  "mt-3 w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function ReviewForm({
  productId,
  isLoggedIn,
  defaultName,
}: {
  productId: string;
  isLoggedIn: boolean;
  defaultName: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(defaultName);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl2 border border-line bg-cream-deep p-6 text-center">
        <p className="text-ink-soft">{t.loginToReview}</p>
        <Link href="/login" className="btn-primary mt-3 inline-block">{t.logIn}</Link>
      </div>
    );
  }

  async function submit() {
    if (!rating) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await submitReview({ productId, rating, comment, name });
    if (res.ok) {
      setStatus("sent");
      setComment("");
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl2 border border-line bg-white p-6">
      <h3 className="text-lg">{t.writeReview}</h3>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={n + " star"}
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill={n <= (hover || rating) ? "#E0A458" : "none"}
              stroke="#E0A458"
              strokeWidth={1.5}
            >
              <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
            </svg>
          </button>
        ))}
      </div>

      <input
        className={field}
        placeholder={t.fullName}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className={field}
        rows={3}
        placeholder={t.reviewComment}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {status === "error" && <p className="mt-2 text-sm text-red-600">{t.reviewError}</p>}
      {status === "sent" && <p className="mt-2 text-sm text-sage-deep">{t.reviewThanks}</p>}

      <button
        onClick={submit}
        disabled={status === "sending"}
        className="btn-primary mt-4 w-full text-center disabled:opacity-60"
      >
        {status === "sending" ? t.processing : t.submitReview}
      </button>
    </div>
  );
}