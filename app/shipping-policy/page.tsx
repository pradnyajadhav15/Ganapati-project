import PageHero from "@/components/PageHero";

export const metadata = { title: "Shipping Policy - R. Ramesh Arts Studio" };

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Policies" title="Shipping Policy" swatch="from-sage to-cream-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-3xl space-y-6 text-ink-soft">
          <p>We ship handcrafted Ganpati idols across India, packed with extra care to protect every detail.</p>

          <h2 className="font-display text-2xl text-ink">Processing Time</h2>
          <p>Ready-stock orders are dispatched within 2 to 3 business days. Custom orders take longer depending on the design and size, and a timeline is shared at the time of order.</p>

          <h2 className="font-display text-2xl text-ink">Delivery Time</h2>
          <p>Once dispatched, delivery typically takes 4 to 8 business days depending on your location. Tracking details are shared by phone and WhatsApp as soon as the order is on its way.</p>

          <h2 className="font-display text-2xl text-ink">Festive Season</h2>
          <p>During Ganesh Chaturthi season, demand is very high. We recommend placing your order well in advance so your idol reaches you on time.</p>

          <h2 className="font-display text-2xl text-ink">Shipping Charges</h2>
          <p>Shipping charges are calculated based on the size and weight of the idol and your delivery location. The final amount is shown at checkout.</p>

          <h2 className="font-display text-2xl text-ink">Local Pickup</h2>
          <p>Customers in and around Solapur can pick up directly from our studio at 34/A1/26, Geeta Nagar, New Paccha Peth, Solapur, 413005. Call +91 70202 90393 to arrange a time.</p>

          <h2 className="font-display text-2xl text-ink">Damaged or Lost Shipments</h2>
          <p>If a package arrives damaged or does not reach you, please contact us within 48 hours. See our Refund Policy for the next steps.</p>
        </div>
      </section>
    </>
  );
}