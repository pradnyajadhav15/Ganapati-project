import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const metadata = { title: "Contact Us - R. Ramesh Arts Studio" };

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.getInTouch} title={t.contactUs} swatch="from-sage to-cream-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-4xl">
          <p className="mb-10 text-center text-ink-soft">
            {t.contactIntro}
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <a href="tel:+917020290393" className="rounded-xl2 border border-line bg-white p-7 text-center transition hover:-translate-y-1.5 hover:shadow-soft">
              <h3 className="text-lg">{t.callUs}</h3>
              <p className="mt-2 text-sm text-sage-deep">+91 70202 90393</p>
            </a>

            <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="rounded-xl2 border border-line bg-white p-7 text-center transition hover:-translate-y-1.5 hover:shadow-soft">
              <h3 className="text-lg">WhatsApp</h3>
              <p className="mt-2 text-sm text-sage-deep">{t.chatWithUs}</p>
            </a>

            <a href="https://maps.app.goo.gl/tPe3iQTDan6Fqe2N8?g_st=iw" target="_blank" rel="noreferrer" className="rounded-xl2 border border-line bg-white p-7 text-center transition hover:-translate-y-1.5 hover:shadow-soft">
              <h3 className="text-lg">{t.visit}</h3>
              <p className="mt-2 text-sm text-sage-deep">{t.getDirections}</p>
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <div className="rounded-xl2 border border-line bg-cream-deep p-7">
              <h3 className="text-lg">{t.ourStudio}</h3>
              <p className="mt-2 text-ink-soft">34/A1/26, Geeta Nagar, New Paccha Peth, Solapur, 413005</p>
              <p className="mt-4 text-sm text-sage-deep">{t.callAhead}</p>
            </div>

            <div className="overflow-hidden rounded-xl2 border border-line">
              <iframe title="R. Ramesh Arts Studio location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.7260809424456!2d75.92644179999999!3d17.6631279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5db5b463ede03%3A0xfe7d4ed882a3ee80!2sR%20Ramesh%20Art%27s!5e0!3m2!1sen!2sin!4v1780677435881!5m2!1sen!2sin" width="100%" height="320" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}