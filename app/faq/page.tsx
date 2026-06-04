import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getLocale } from "@/lib/locale";
import { type Locale } from "@/lib/i18n";

export const metadata = { title: "FAQ - R. Ramesh Arts Studio" };

const T: Record<string, Record<Locale, string>> = {
  kicker: { en: "Help", hi: "सहायता", mr: "मदत" },
  title: {
    en: "Frequently Asked Questions",
    hi: "अक्सर पूछे जाने वाले प्रश्न",
    mr: "वारंवार विचारले जाणारे प्रश्न",
  },
  intro: {
    en: "Answers to common questions about our idols, orders, delivery, and pre-booking. Can't find what you're looking for? Reach out any time.",
    hi: "हमारी मूर्तियों, ऑर्डर, डिलीवरी और प्री-बुकिंग के बारे में सामान्य प्रश्नों के उत्तर। जो खोज रहे हैं वह नहीं मिला? कभी भी संपर्क करें।",
    mr: "आमच्या मूर्ती, ऑर्डर, डिलिव्हरी आणि प्री-बुकिंगबद्दलच्या सामान्य प्रश्नांची उत्तरे. तुम्ही शोधत आहात ते सापडले नाही? कधीही संपर्क करा.",
  },
  still: { en: "Still have questions?", hi: "अभी भी प्रश्न हैं?", mr: "अजूनही प्रश्न आहेत?" },
  contact: { en: "Contact us", hi: "संपर्क करें", mr: "संपर्क करा" },
  whatsapp: { en: "WhatsApp us", hi: "WhatsApp करें", mr: "WhatsApp करा" },
};

const FAQS: { q: Record<Locale, string>; a: Record<Locale, string> }[] = [
  {
    q: {
      en: "What are your idols made of?",
      hi: "आपकी मूर्तियाँ किससे बनी होती हैं?",
      mr: "तुमच्या मूर्ती कशापासून बनवल्या जातात?",
    },
    a: {
      en: "We craft idols in three materials: Shadu Mati (natural river clay), fiber, and plaster (POP). Shadu Mati idols are fully eco-friendly, fiber idols are lightweight and reusable, and plaster idols offer fine detail with a smooth painted finish.",
      hi: "हम तीन सामग्रियों में मूर्तियाँ बनाते हैं: शाडू माटी (प्राकृतिक नदी की मिट्टी), फाइबर, और प्लास्टर (POP)। शाडू माटी की मूर्तियाँ पूरी तरह पर्यावरण-अनुकूल होती हैं, फाइबर की मूर्तियाँ हल्की और पुन: उपयोग योग्य होती हैं, और प्लास्टर की मूर्तियाँ चिकनी पेंट फिनिश के साथ बारीक नक्काशी देती हैं।",
      mr: "आम्ही तीन प्रकारच्या साहित्यात मूर्ती बनवतो: शाडू माती (नैसर्गिक नदीची माती), फायबर, आणि प्लास्टर (POP). शाडू मातीच्या मूर्ती पूर्णपणे पर्यावरणपूरक असतात, फायबरच्या मूर्ती हलक्या व पुनर्वापरयोग्य असतात, आणि प्लास्टरच्या मूर्ती गुळगुळीत रंगकामासह बारीक कोरीवकाम देतात.",
    },
  },
  {
    q: {
      en: "Are your idols eco-friendly?",
      hi: "क्या आपकी मूर्तियाँ पर्यावरण-अनुकूल हैं?",
      mr: "तुमच्या मूर्ती पर्यावरणपूरक आहेत का?",
    },
    a: {
      en: "Yes. Our Shadu Mati idols are made from 100% natural clay that dissolves cleanly back into water, leaving no pollution. If you'd like the most eco-friendly option, choose our Shadu Mati collection.",
      hi: "हाँ। हमारी शाडू माटी की मूर्तियाँ 100% प्राकृतिक मिट्टी से बनी होती हैं जो पानी में साफ-साफ घुल जाती हैं और कोई प्रदूषण नहीं छोड़तीं। यदि आप सबसे पर्यावरण-अनुकूल विकल्प चाहते हैं, तो हमारा शाडू माटी संग्रह चुनें।",
      mr: "होय. आमच्या शाडू मातीच्या मूर्ती 100% नैसर्गिक मातीपासून बनवलेल्या असतात ज्या पाण्यात स्वच्छपणे विरघळतात आणि कोणतेही प्रदूषण होत नाही. सर्वात पर्यावरणपूरक पर्याय हवा असल्यास, आमचा शाडू माती संग्रह निवडा.",
    },
  },
  {
    q: {
      en: "Do you make custom idols?",
      hi: "क्या आप कस्टम मूर्तियाँ बनाते हैं?",
      mr: "तुम्ही कस्टम मूर्ती बनवता का?",
    },
    a: {
      en: "Yes, we take custom orders. Tell us the size, style, and design you have in mind and our artisans will craft it for you. Visit our Customized Work page or message us on WhatsApp to discuss your idea.",
      hi: "हाँ, हम कस्टम ऑर्डर लेते हैं। आपके मन में जो आकार, शैली और डिज़ाइन है वह हमें बताएँ और हमारे कारीगर उसे आपके लिए बनाएँगे। अपना विचार साझा करने के लिए हमारा कस्टमाइज़्ड वर्क पेज देखें या WhatsApp पर संदेश करें।",
      mr: "होय, आम्ही कस्टम ऑर्डर घेतो. तुमच्या मनातील आकार, शैली आणि डिझाइन आम्हाला सांगा आणि आमचे कारागीर ते तुमच्यासाठी बनवतील. तुमची कल्पना सांगण्यासाठी आमचे कस्टमाइज्ड वर्क पेज पाहा किंवा WhatsApp वर संदेश करा.",
    },
  },
  {
    q: {
      en: "Can I pre-book an idol for Ganesh Chaturthi?",
      hi: "क्या मैं गणेश चतुर्थी के लिए मूर्ति प्री-बुक कर सकता हूँ?",
      mr: "मी गणेश चतुर्थीसाठी मूर्ती प्री-बुक करू शकतो का?",
    },
    a: {
      en: "Absolutely. On any product page you can pre-book for the season with a small advance (about 25%) and pay the balance on delivery. We'll confirm the details with you over WhatsApp. Booking early helps you avoid the festival rush.",
      hi: "बिल्कुल। किसी भी प्रोडक्ट पेज पर आप थोड़ी अग्रिम राशि (लगभग 25%) के साथ सीज़न के लिए प्री-बुक कर सकते हैं और शेष राशि डिलीवरी पर दे सकते हैं। हम WhatsApp पर आपसे विवरण की पुष्टि करेंगे। जल्दी बुकिंग करने से त्योहार की भीड़ से बचा जा सकता है।",
      mr: "नक्कीच. कोणत्याही प्रोडक्ट पेजवर तुम्ही थोड्या आगाऊ रकमेसह (सुमारे 25%) हंगामासाठी प्री-बुक करू शकता आणि उर्वरित रक्कम डिलिव्हरीवर देऊ शकता. आम्ही WhatsApp वर तुमच्याशी तपशील निश्चित करू. लवकर बुकिंग केल्याने सणाची गर्दी टाळता येते.",
    },
  },
  {
    q: {
      en: "How do I order and pay?",
      hi: "मैं ऑर्डर और भुगतान कैसे करूँ?",
      mr: "मी ऑर्डर आणि पेमेंट कसे करू?",
    },
    a: {
      en: "Browse our collections, add an idol to your cart, and check out securely online. We accept UPI, cards, net banking, and wallets through Razorpay. You can also order directly over WhatsApp if you prefer.",
      hi: "हमारे संग्रह देखें, किसी मूर्ति को अपनी कार्ट में जोड़ें, और ऑनलाइन सुरक्षित रूप से चेकआउट करें। हम Razorpay के माध्यम से UPI, कार्ड, नेट बैंकिंग और वॉलेट स्वीकार करते हैं। यदि आप चाहें तो सीधे WhatsApp पर भी ऑर्डर कर सकते हैं।",
      mr: "आमचे संग्रह पाहा, मूर्ती तुमच्या कार्टमध्ये जोडा, आणि ऑनलाइन सुरक्षितपणे चेकआउट करा. आम्ही Razorpay द्वारे UPI, कार्ड, नेट बँकिंग आणि वॉलेट स्वीकारतो. तुम्हाला हवे असल्यास थेट WhatsApp वरही ऑर्डर करू शकता.",
    },
  },
  {
    q: {
      en: "Do you deliver?",
      hi: "क्या आप डिलीवरी करते हैं?",
      mr: "तुम्ही डिलिव्हरी करता का?",
    },
    a: {
      en: "We're based in Solapur and deliver locally. For other locations, please message us with your address and we'll let you know the options and timing. For delicate idols we recommend local pickup or a careful courier, and we'll guide you.",
      hi: "हम सोलापुर में स्थित हैं और स्थानीय रूप से डिलीवरी करते हैं। अन्य स्थानों के लिए, कृपया अपने पते के साथ हमें संदेश करें और हम आपको विकल्प और समय बताएँगे। नाज़ुक मूर्तियों के लिए हम स्थानीय पिकअप या सावधानीपूर्वक कूरियर की सलाह देते हैं, और हम आपका मार्गदर्शन करेंगे।",
      mr: "आम्ही सोलापूरमध्ये आहोत आणि स्थानिक पातळीवर डिलिव्हरी करतो. इतर ठिकाणांसाठी, कृपया तुमच्या पत्त्यासह आम्हाला संदेश करा आणि आम्ही तुम्हाला पर्याय व वेळ सांगू. नाजूक मूर्तींसाठी आम्ही स्थानिक पिकअप किंवा काळजीपूर्वक कुरियरची शिफारस करतो, आणि आम्ही तुम्हाला मार्गदर्शन करू.",
    },
  },
  {
    q: {
      en: "How should I care for and immerse my idol?",
      hi: "मुझे अपनी मूर्ति की देखभाल और विसर्जन कैसे करना चाहिए?",
      mr: "मी माझ्या मूर्तीची काळजी आणि विसर्जन कसे करावे?",
    },
    a: {
      en: "Keep your idol away from moisture and handle it gently before the festival. For visarjan, Shadu Mati idols can be immersed in a bucket or tank of water at home and dissolve naturally, an eco-friendly way to honour the tradition.",
      hi: "त्योहार से पहले अपनी मूर्ति को नमी से दूर रखें और इसे सावधानी से संभालें। विसर्जन के लिए, शाडू माटी की मूर्तियों को घर पर ही पानी की बाल्टी या टंकी में विसर्जित किया जा सकता है और वे प्राकृतिक रूप से घुल जाती हैं, परंपरा का सम्मान करने का एक पर्यावरण-अनुकूल तरीका।",
      mr: "सणाआधी तुमची मूर्ती ओलाव्यापासून दूर ठेवा आणि ती हळुवारपणे हाताळा. विसर्जनासाठी, शाडू मातीच्या मूर्ती घरीच पाण्याच्या बादलीत किंवा टाकीत विसर्जित करता येतात आणि त्या नैसर्गिकरित्या विरघळतात, परंपरेचा सन्मान करण्याचा एक पर्यावरणपूरक मार्ग.",
    },
  },
];

export default function FAQPage() {
  const locale = getLocale();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  return (
    <>
      <PageHero kicker={T.kicker[locale]} title={T.title[locale]} swatch="from-peach to-cream-deep" />
      <section className="site-wrap py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <p className="mx-auto mb-8 max-w-2xl text-center text-ink-soft">{T.intro[locale]}</p>

        <div className="mx-auto max-w-2xl space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="group rounded-xl2 border border-line bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span>{f.q[locale]}</span>
                <span className="ml-4 text-xl text-terracotta transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a[locale]}</p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-xl2 border border-line bg-cream-deep p-6 text-center">
          <p className="font-medium">{T.still[locale]}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">{T.contact[locale]}</Link>
            <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-ghost">{T.whatsapp[locale]}</a>
          </div>
        </div>
      </section>
    </>
  );
}
