import PageHero from "@/components/PageHero";

export const metadata = { title: "Privacy Policy - R. Ramesh Arts Studio" };

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Policies" title="Privacy Policy" swatch="from-sage to-peach" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-3xl space-y-6 text-ink-soft">
          <p>Your trust matters to us. This Privacy Policy explains what information we collect and how we use it.</p>

          <h2 className="font-display text-2xl text-ink">Information We Collect</h2>
          <p>When you place an order or create an account, we collect your name, phone number, email, shipping address and order details. Payment information is handled by Razorpay and is not stored on our servers.</p>

          <h2 className="font-display text-2xl text-ink">How We Use It</h2>
          <p>We use your information only to process and deliver your order, to communicate about your purchase, and to provide customer support. We do not sell or rent your personal information to anyone.</p>

          <h2 className="font-display text-2xl text-ink">Third Parties</h2>
          <p>We share necessary order details with our payment partner (Razorpay) and our shipping partners so that your order can be paid for and delivered. These partners follow their own privacy practices.</p>

          <h2 className="font-display text-2xl text-ink">Cookies</h2>
          <p>This site uses essential cookies to keep you signed in and to remember your cart. We do not run third-party advertising trackers.</p>

          <h2 className="font-display text-2xl text-ink">Your Rights</h2>
          <p>You can ask to view, correct or delete the personal information we hold about you at any time. Write to us using the details below.</p>

          <h2 className="font-display text-2xl text-ink">Data Retention</h2>
          <p>We keep order records for as long as required for accounting, tax and warranty purposes.</p>

          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p>For any privacy-related question, reach us at +91 70202 90393 or through the Contact page. Studio address: 34/A1/26, Geeta Nagar, New Paccha Peth, Solapur, 413005.</p>
        </div>
      </section>
    </>
  );
}