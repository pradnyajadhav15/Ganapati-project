import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getLocale } from "@/lib/locale";

export const metadata = {
  title: "Caring for Your Ganpati Idol — R. Ramesh Arts Studio",
  description:
    "How to unpack, carry, place and clean your Ganpati idol, and what to do at visarjan, so it stays whole from arrival to immersion.",
};

/**
 * NOTE FOR THE STUDIO: this advice was written from general handling
 * knowledge, not dictated by you. Read it once and correct anything that
 * differs from what you tell customers in person — people will follow it.
 */
const T = {
  en: {
    kicker: "After it arrives",
    title: "Caring for Your Murti",
    sub: "A hand-sculpted idol is strong, but it is not indestructible. A few minutes of care keeps it whole from the day it arrives to the day of visarjan.",
    steps: [
      {
        h: "Unpack it where it will stand",
        p: "Open the box at floor level, near the spot the murti will occupy. Most damage happens while carrying an unwrapped idol across a room.",
      },
      {
        h: "Lift from the base, never the limbs",
        p: "Take the weight under the base with both hands. Arms, the trunk, the crown and any raised weapon are the thinnest points and will take the strain first.",
      },
      {
        h: "Give it a flat, dry seat",
        p: "A level wooden chowrang or table is ideal. Avoid a wobbling surface, a cloth that can slide, and direct contact with a damp floor.",
      },
      {
        h: "Keep it out of sun and rain",
        p: "Long direct sunlight fades hand-mixed colour. Damp softens clay and can lift paint. A shaded indoor spot suits every material we make.",
      },
      {
        h: "Dust it, do not wash it",
        p: "A dry, soft cloth or a clean brush is enough. Water, soap and cleaning liquids will dull the paint and, on clay, begin dissolving the surface.",
      },
      {
        h: "Decorate without adhesive",
        p: "Drape and tie ornaments rather than gluing or taping them. Tape lifts paint when it comes off, and glue leaves a mark that cannot be repaired.",
      },
    ],
    visarjanTitle: "At visarjan",
    visarjan: [
      {
        h: "Shadu Mati — clay",
        p: "Made to return to water. It dissolves cleanly, and a bucket or drum at home works as well as a water body.",
      },
      {
        h: "Plaster (POP)",
        p: "Dissolves slowly. Many cities ask for an immersion tank rather than a river or lake — please follow whatever your municipality has arranged that year.",
      },
      {
        h: "Fibre and dashboard idols",
        p: "Not made for immersion. These are kept, cleaned and brought out again next year.",
      },
    ],
    breakTitle: "If something breaks",
    breakBody:
      "Message us on WhatsApp with a photo before you try to repair it yourself. Some breaks we can guide you through, and some we would rather fix ourselves.",
    breakCta: "Send us a photo",
    materialsCta: "Not sure which material you have?",
  },
  hi: {
    kicker: "मूर्ति आने के बाद",
    title: "अपनी मूर्ति की देखभाल",
    sub: "हाथ से बनी मूर्ति मज़बूत होती है, पर अटूट नहीं। थोड़ी सी सावधानी उसे आने के दिन से विसर्जन तक सुरक्षित रखती है।",
    steps: [
      { h: "वहीं खोलें जहाँ मूर्ति रखनी है", p: "डिब्बा ज़मीन पर, उसी जगह के पास खोलें जहाँ मूर्ति विराजेगी। सबसे ज़्यादा नुकसान खुली मूर्ति को कमरे में ले जाते समय होता है।" },
      { h: "आधार से उठाएँ, हाथ-पैर से नहीं", p: "दोनों हाथों से आधार के नीचे से वज़न लें। भुजाएँ, सूँड, मुकुट और उठे हुए आयुध सबसे नाज़ुक हिस्से हैं।" },
      { h: "समतल, सूखी जगह दें", p: "सीधा लकड़ी का चौरंग या मेज़ सबसे अच्छा है। हिलती सतह, फिसलने वाला कपड़ा और गीले फर्श से बचें।" },
      { h: "धूप और बारिश से बचाएँ", p: "लंबी सीधी धूप हाथ से बने रंगों को फीका करती है। नमी मिट्टी को नरम करती है और रंग उखाड़ सकती है।" },
      { h: "झाड़ें, धोएँ नहीं", p: "सूखा मुलायम कपड़ा या साफ़ ब्रश काफ़ी है। पानी, साबुन और क्लीनर रंग फीका करते हैं और मिट्टी की सतह घोलने लगते हैं।" },
      { h: "बिना गोंद के सजाएँ", p: "गहने चिपकाने के बजाय बाँधें या लपेटें। टेप उतरते समय रंग उखाड़ता है और गोंद का निशान ठीक नहीं होता।" },
    ],
    visarjanTitle: "विसर्जन पर",
    visarjan: [
      { h: "शाडू माटी — मिट्टी", p: "पानी में लौटने के लिए ही बनी है। यह पूरी तरह घुल जाती है, और घर पर बाल्टी या ड्रम भी उतना ही अच्छा है।" },
      { h: "प्लास्टर (POP)", p: "धीरे घुलता है। कई शहरों में नदी या तालाब के बजाय विसर्जन कुंड ज़रूरी है — उस वर्ष नगरपालिका की व्यवस्था का पालन करें।" },
      { h: "फाइबर और डैशबोर्ड मूर्तियाँ", p: "विसर्जन के लिए नहीं बनीं। इन्हें सँभालकर रखा जाता है और अगले साल फिर विराजमान किया जाता है।" },
    ],
    breakTitle: "अगर कुछ टूट जाए",
    breakBody: "खुद ठीक करने से पहले व्हाट्सएप पर फ़ोटो भेजिए। कुछ चीज़ें हम आपको बता सकते हैं, और कुछ हम खुद ठीक करना पसंद करेंगे।",
    breakCta: "हमें फ़ोटो भेजें",
    materialsCta: "पता नहीं आपकी मूर्ति किस सामग्री की है?",
  },
  mr: {
    kicker: "मूर्ती आल्यानंतर",
    title: "तुमच्या मूर्तीची काळजी",
    sub: "हाताने घडवलेली मूर्ती मजबूत असते, पण अभंग नाही. थोडीशी काळजी तिला येण्याच्या दिवसापासून विसर्जनापर्यंत सुरक्षित ठेवते.",
    steps: [
      { h: "जिथे ठेवायची तिथेच उघडा", p: "खोका जमिनीवर, मूर्ती जिथे विराजमान होणार आहे त्याच जागेजवळ उघडा. उघडी मूर्ती खोलीभर नेताना सर्वाधिक नुकसान होते." },
      { h: "पायथ्याकडून उचला, हातापायांनी नको", p: "दोन्ही हातांनी पायथ्याखालून वजन घ्या. हात, सोंड, मुकुट आणि उंचावलेली आयुधे सर्वात नाजूक भाग आहेत." },
      { h: "सपाट, कोरडी जागा द्या", p: "सरळ लाकडी चौरंग किंवा टेबल उत्तम. हलणारी पृष्ठभाग, घसरणारे कापड आणि ओली जमीन टाळा." },
      { h: "ऊन आणि पावसापासून जपा", p: "दीर्घ थेट ऊन हाताने केलेले रंग फिके करते. ओलावा माती मऊ करतो आणि रंग उडू शकतो." },
      { h: "पुसा, धुवू नका", p: "कोरडे मऊ कापड किंवा स्वच्छ ब्रश पुरेसा आहे. पाणी, साबण आणि क्लीनर रंग निस्तेज करतात आणि मातीचा पृष्ठभाग विरघळवू लागतात." },
      { h: "गोंदाशिवाय सजवा", p: "दागिने चिकटवण्याऐवजी बांधा किंवा गुंडाळा. टेप निघताना रंग उचकटतो आणि गोंदाचा डाग दुरुस्त होत नाही." },
    ],
    visarjanTitle: "विसर्जनाला",
    visarjan: [
      { h: "शाडू माती", p: "पाण्यात परत जाण्यासाठीच घडवलेली. ती पूर्णपणे विरघळते, आणि घरी बादली किंवा ड्रमही तितकाच चांगला पर्याय आहे." },
      { h: "प्लास्टर (POP)", p: "हळू विरघळते. अनेक शहरांत नदी किंवा तलावाऐवजी विसर्जन कुंड आवश्यक असते — त्या वर्षी महापालिकेने केलेल्या व्यवस्थेचे पालन करा." },
      { h: "फायबर आणि डॅशबोर्ड मूर्ती", p: "विसर्जनासाठी बनवलेल्या नाहीत. या जपून ठेवल्या जातात आणि पुढच्या वर्षी पुन्हा विराजमान होतात." },
    ],
    breakTitle: "काही तुटले तर",
    breakBody: "स्वतः दुरुस्त करण्याआधी व्हॉट्सअॅपवर फोटो पाठवा. काही गोष्टी आम्ही तुम्हाला सांगू शकतो, तर काही आम्ही स्वतः दुरुस्त करणे पसंत करू.",
    breakCta: "आम्हाला फोटो पाठवा",
    materialsCta: "तुमची मूर्ती कोणत्या साहित्याची आहे माहीत नाही?",
  },
} as const;

export default function CarePage() {
  const locale = getLocale();
  const t = T[locale] ?? T.en;

  return (
    <>
      <PageHero kicker={t.kicker} title={t.title} sub={t.sub} swatch="from-peach to-cream-deep" />

      <section className="site-wrap py-[80px]">
        <ol className="grid gap-5 md:grid-cols-2">
          {t.steps.map((s, i) => (
            <Reveal as="li" key={s.h} delay={i * 70}>
              <div className="h-full rounded-xl2 border border-line-soft bg-white p-6 shadow-lux">
                <div className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-gold-sheen font-display text-sm font-semibold text-ink-deep">
                  {i + 1}
                </div>
                <h2 className="text-[1.15rem] leading-snug">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14">
          <div className="ornament mb-6">
            <span className="kicker">{t.visarjanTitle}</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {t.visarjan.map((v) => (
              <div key={v.h} className="rounded-xl2 border border-line-soft bg-cream-warm p-6">
                <h3 className="text-[1.05rem]">{v.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-ink-soft">
            <Link href="/materials" className="font-semibold text-sage-deep underline underline-offset-4">
              {t.materialsCta}
            </Link>
          </p>
        </Reveal>

        <Reveal className="mt-14 rounded-xl3 border border-line-soft bg-white p-8 text-center shadow-lux">
          <h2 className="text-2xl">{t.breakTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-soft">{t.breakBody}</p>
          <a
            href="https://wa.me/917020290393"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            {t.breakCta}
          </a>
        </Reveal>
      </section>
    </>
  );
}
