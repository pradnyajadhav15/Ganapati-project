import type { Category } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

/**
 * Shared description of what each material actually is, used by the comparison
 * guide and by the collection pages so the two can never drift apart.
 *
 * NOTE FOR THE STUDIO: the craft claims below were written from general
 * knowledge of these materials, not from your workshop. Please read them
 * through and correct anything that does not match how you actually work —
 * particularly the immersion notes, which customers will act on.
 */

export type Trait = {
  finish: string;
  weight: string;
  immersion: string;
  reuse: string;
  bestFor: string;
};

export type Material = {
  category: Category;
  href: string;
  /** Accent used for the collection header and the guide card. */
  accent: string;
  ring: string;
  tint: string;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  traits: Record<Locale, Trait>;
};

export const MATERIALS: Material[] = [
  {
    category: "shadu-mati-idols",
    href: "/collections/shadu-mati-idols",
    accent: "text-sage-dark",
    ring: "ring-sage/40",
    tint: "bg-[linear-gradient(160deg,rgba(175,194,168,.22),rgba(175,194,168,.05))]",
    name: { en: "Shadu Mati", hi: "शाडू माटी", mr: "शाडू माती" },
    tagline: {
      en: "Natural river clay, the traditional choice",
      hi: "प्राकृतिक नदी की मिट्टी, पारंपरिक विकल्प",
      mr: "नैसर्गिक नदीची माती, पारंपरिक पर्याय",
    },
    traits: {
      en: {
        finish: "Soft, natural, matte",
        weight: "Heaviest for its size",
        immersion: "Dissolves back into water",
        reuse: "One season",
        bestFor: "Home visarjan, and anyone who wants the eco choice",
      },
      hi: {
        finish: "कोमल, प्राकृतिक, मैट",
        weight: "आकार के अनुसार सबसे भारी",
        immersion: "पानी में घुल जाती है",
        reuse: "एक मौसम",
        bestFor: "घर पर विसर्जन और पर्यावरण-अनुकूल विकल्प चाहने वालों के लिए",
      },
      mr: {
        finish: "मऊ, नैसर्गिक, मॅट",
        weight: "आकाराच्या मानाने सर्वात जड",
        immersion: "पाण्यात विरघळते",
        reuse: "एक हंगाम",
        bestFor: "घरगुती विसर्जन आणि पर्यावरणपूरक पर्याय हवा असणाऱ्यांसाठी",
      },
    },
  },
  {
    category: "pop-idols",
    href: "/collections/pop-idols",
    accent: "text-gold-deep",
    ring: "ring-gold/40",
    tint: "bg-[linear-gradient(160deg,rgba(201,162,75,.18),rgba(201,162,75,.04))]",
    name: { en: "Plaster (POP)", hi: "प्लास्टर (POP)", mr: "प्लास्टर (POP)" },
    tagline: {
      en: "Holds the finest detail",
      hi: "सबसे बारीक नक्काशी संभालता है",
      mr: "सर्वात बारीक कोरीव काम टिकवते",
    },
    traits: {
      en: {
        finish: "Smooth, crisp, brightly painted",
        weight: "Lighter than clay",
        immersion: "Slow to dissolve — many cities ask for an immersion tank rather than a river or lake. Please check your local rules.",
        reuse: "One season",
        bestFor: "Fine detail and vivid colour, where an immersion tank is available",
      },
      hi: {
        finish: "चिकना, स्पष्ट, चमकीले रंगों वाला",
        weight: "मिट्टी से हल्का",
        immersion: "धीरे घुलता है — कई शहरों में नदी या तालाब के बजाय विसर्जन कुंड ज़रूरी है। अपने स्थानीय नियम देखें।",
        reuse: "एक मौसम",
        bestFor: "बारीक नक्काशी और चटख रंग, जहाँ विसर्जन कुंड उपलब्ध हो",
      },
      mr: {
        finish: "गुळगुळीत, स्पष्ट, ठळक रंगकाम",
        weight: "मातीपेक्षा हलके",
        immersion: "हळू विरघळते — अनेक शहरांत नदी किंवा तलावाऐवजी विसर्जन कुंड आवश्यक असते. स्थानिक नियम तपासा.",
        reuse: "एक हंगाम",
        bestFor: "बारीक काम आणि ठळक रंग, जिथे विसर्जन कुंड उपलब्ध आहे",
      },
    },
  },
  {
    category: "fiber-idols",
    href: "/collections/fiber-idols",
    accent: "text-terracotta-deep",
    ring: "ring-terracotta/40",
    tint: "bg-[linear-gradient(160deg,rgba(217,167,139,.22),rgba(217,167,139,.05))]",
    name: { en: "Fibre", hi: "फाइबर", mr: "फायबर" },
    tagline: {
      en: "Light, strong, made to last years",
      hi: "हल्का, मज़बूत, वर्षों तक चलने वाला",
      mr: "हलके, मजबूत, वर्षानुवर्षे टिकणारे",
    },
    traits: {
      en: {
        finish: "Smooth and durable",
        weight: "Lightest — easy to carry and place",
        immersion: "Not for immersion — kept and reused",
        reuse: "Year after year",
        bestFor: "Mandals, large idols, and anyone reusing the same murti each year",
      },
      hi: {
        finish: "चिकना और टिकाऊ",
        weight: "सबसे हल्का — उठाना और रखना आसान",
        immersion: "विसर्जन के लिए नहीं — सँभालकर दोबारा उपयोग करें",
        reuse: "हर साल",
        bestFor: "मंडल, बड़ी मूर्तियाँ, और हर साल वही मूर्ति उपयोग करने वालों के लिए",
      },
      mr: {
        finish: "गुळगुळीत आणि टिकाऊ",
        weight: "सर्वात हलके — उचलायला आणि ठेवायला सोपे",
        immersion: "विसर्जनासाठी नाही — जपून पुन्हा वापरतात",
        reuse: "दरवर्षी",
        bestFor: "मंडळे, मोठ्या मूर्ती आणि दरवर्षी तीच मूर्ती वापरणाऱ्यांसाठी",
      },
    },
  },
  {
    category: "dashboard-idols",
    href: "/collections/dashboard-idols",
    accent: "text-sage-deep",
    ring: "ring-line",
    tint: "bg-[linear-gradient(160deg,rgba(242,201,168,.22),rgba(242,201,168,.05))]",
    name: { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
    tagline: {
      en: "Small enough for a car or a shelf",
      hi: "कार या शेल्फ के लिए छोटी",
      mr: "गाडी किंवा कपाटासाठी लहान",
    },
    traits: {
      en: {
        finish: "Compact, hand-painted",
        weight: "Very light",
        immersion: "Kept, not immersed",
        reuse: "Year after year",
        bestFor: "Car dashboards, desks and small home altars",
      },
      hi: {
        finish: "छोटी, हाथ से रंगी",
        weight: "बहुत हल्की",
        immersion: "रखी जाती है, विसर्जित नहीं",
        reuse: "हर साल",
        bestFor: "कार डैशबोर्ड, डेस्क और छोटे घरेलू मंदिर",
      },
      mr: {
        finish: "लहान, हाताने रंगवलेली",
        weight: "अतिशय हलकी",
        immersion: "जपून ठेवतात, विसर्जन करत नाहीत",
        reuse: "दरवर्षी",
        bestFor: "गाडीचा डॅशबोर्ड, टेबल आणि लहान घरगुती देव्हारा",
      },
    },
  },
];

export function materialFor(category: Category): Material | undefined {
  return MATERIALS.find((m) => m.category === category);
}
