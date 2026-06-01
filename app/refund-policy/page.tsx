import PageHero from "@/components/PageHero";

export const metadata = { title: "Refund Policy - R. Ramesh Arts Studio" };

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Policies" title="Refund Policy" swatch="from-rose to-cream-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-3xl space-y-6 text-ink-soft">
          <p>Every idol from R. Ramesh Arts Studio is handcrafted with care. Because of the handmade nature of our work, we follow the policy below for refunds and replacements.</p>

          <h2 className="font-display text-2xl text-ink">Damage in Transit</h2>
          <p>If your idol arrives damaged, please contact us within 48 hours of delivery with clear photos and an unboxing video. We will arrange a free replacement or a full refund, whichever you prefer.</p>

          <h2 className="font-display text-2xl text-ink">Custom Orders</h2>
          <p>Custom and made-to-order idols are non-refundable once production has begun. Cancellations are accepted within 24 hours of placing the order, before work starts.</p>

          <h2 className="font-display text-2xl text-ink">Handcrafted Variations</h2>
          <p>Because every idol is hand-sculpted and hand-painted, small variations in colour, finish or detail are part of the craft and are not considered defects.</p>

          <h2 className="font-display text-2xl text-ink">Refund Timeline</h2>
          <p>Approved refunds are processed within 7 to 10 business days through the original payment method.</p>

          <h2 className="font-display text-2xl text-ink">Need Help?</h2>
          <p>Write to us or call +91 70202 90393. We will do our best to make it right.</p>
        </div>
      </section>
    </>
  );
}