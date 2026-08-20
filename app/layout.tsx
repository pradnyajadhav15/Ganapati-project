import type { Metadata } from "next";
import { Fraunces, Mukta, Martel } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getLocale } from "@/lib/locale";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

// Fraunces carries no Devanagari, so Hindi and Marathi headings would fall
// back to whatever generic serif the device happens to have. Martel is a
// Devanagari serif, so those headings keep the same weight and feel as the
// English ones instead of changing typeface between languages.
const martel = Martel({
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-martel",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
});

const siteUrl = "https://www.rramesharts.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "R. Ramesh Arts Studio - Handcrafted Ganpati Idols in Solapur",
  description:
    "Beautifully detailed, hand-painted Ganpati idols crafted in Solapur. Available in plaster, Shadu Mati and fiber, in many sizes and styles. Custom orders welcome.",
  keywords: [
    "Ganpati idols",
    "Ganesh idols Solapur",
    "handcrafted Ganesh murti",
    "POP Ganpati idol",
    "Shadu Mati idol",
    "custom Ganpati idol",
    "R. Ramesh Arts Studio",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "R. Ramesh Arts Studio",
    title: "R. Ramesh Arts Studio - Handcrafted Ganpati Idols in Solapur",
    description:
      "Beautifully detailed, hand-painted Ganpati idols crafted in Solapur. Plaster, Shadu Mati and fiber. Custom orders welcome.",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "R. Ramesh Arts Studio - Handcrafted Ganpati Idols" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R. Ramesh Arts Studio - Handcrafted Ganpati Idols in Solapur",
    description: "Beautifully detailed, hand-painted Ganpati idols crafted in Solapur. Custom orders welcome.",
    images: ["/og-image.jpg"],
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "R. Ramesh Arts Studio",
  image: siteUrl + "/og-image.jpg",
  "@id": siteUrl,
  url: siteUrl,
  telephone: "+917020290393",
  priceRange: "INR",
  address: {
    "@type": "PostalAddress",
    streetAddress: "34/A1/26, Geeta Nagar, New Paccha Peth",
    addressLocality: "Solapur",
    postalCode: "413005",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <CartProvider>
      <html lang={locale} className={fraunces.variable + " " + martel.variable + " " + mukta.variable}>
        <body>
          {/* Without JS the scroll-reveal observer never runs, so make
              revealed content visible for no-JS clients and crawlers. */}
          <noscript>
            <style>{".on-scroll{opacity:1 !important;transform:none !important}"}</style>
          </noscript>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
          />
          <LocaleProvider locale={locale}>
            <AnnouncementBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </LocaleProvider>
          {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        </body>
      </html>
    </CartProvider>
  );
}
