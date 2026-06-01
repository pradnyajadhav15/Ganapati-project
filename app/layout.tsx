import type { Metadata } from "next";
import { Fraunces, Mukta } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/locale";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
});

const siteUrl = "https://www.rrameshartsstudio.in";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <CartProvider>
      <html lang={locale} className={fraunces.variable + " " + mukta.variable}>
        <body>
          <LocaleProvider locale={locale}>
            <AnnouncementBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LocaleProvider>
        </body>
      </html>
    </CartProvider>
  );
}