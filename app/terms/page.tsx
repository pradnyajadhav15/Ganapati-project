import PageHero from "@/components/PageHero";

export const metadata = { title: "Terms of Service - R. Ramesh Arts Studio" };

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Policies" title="Terms of Service" swatch="from-peach to-rose" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-3xl space-y-6 text-ink-soft">
          <p>Welcome to R. Ramesh Arts Studio. By using this website and placing an order, you agree to the terms below.</p>

          <h2 className="font-display text-2xl text-ink">About Us</h2>
          <p>R. Ramesh Arts Studio is a family-run idol-making studio based in Solapur, Maharashtra. We sell handcrafted Ganpati idols in plaster, Shadu Mati and fiber, along with related accessories.</p>

          <h2 className="font-display text-2xl text-ink">Products</h2>
          <p>Every idol is hand-sculpted and hand-painted. Photos on the site are representative. Minor variations in colour, finish and detail are natural and not considered defects.</p>

          <h2 className="font-display text-2xl text-ink">Orders and Pricing</h2>
          <p>All prices are listed in Indian Rupees and include applicable taxes unless mentioned otherwise. We reserve the right to update prices, to accept or decline any order, and to correct errors on the site.</p>

          <h2 className="font-display text-2xl text-ink">Payments</h2>
          <p>Payments are processed securely through Razorpay. We do not store your card details on our servers.</p>

          <h2 className="font-display text-2xl text-ink">Shipping, Returns and Refunds</h2>
          <p>Shipping, returns and refunds are governed by our Shipping Policy and Refund Policy, which form a part of these terms.</p>

          <h2 className="font-display text-2xl text-ink">Intellectual Property</h2>
          <p>All content on this site, including photos, designs and text, belongs to R. Ramesh Arts Studio and may not be copied or reused without written permission.</p>

          <h2 className="font-display text-2xl text-ink">Liability</h2>
          <p>We are not liable for any indirect or consequential loss arising from the use of our products or website. Our liability is limited to the value of the order in question.</p>

          <h2 className="font-display text-2xl text-ink">Governing Law</h2>
          <p>These terms are governed by the laws of India. Any dispute will be subject to the exclusive jurisdiction of the courts at Solapur, Maharashtra.</p>

          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p>Questions? Reach us at +91 70202 90393 or through the Contact page.</p>
        </div>
      </section>
    </>
  );
}