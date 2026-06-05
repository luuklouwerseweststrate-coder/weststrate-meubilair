import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import { siteUrl, organisatieJsonLd, jsonLdScript } from "@/lib/seo";
import "./globals.css";

// Brandbook-fonts: Nunito (koppen, 800/900) + Inter (body)
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const TITEL = "Weststrate Meubilair | Complete projectinrichting en kantoormeubilair";
const OMSCHRIJVING =
  "Weststrate richt complete ruimtes in: van één ergonomische stoel tot de inrichting van een heel pand. Advies, levering en montage uit één hand.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: TITEL,
    template: "%s · Weststrate Meubilair",
  },
  description: OMSCHRIJVING,
  applicationName: "Weststrate Meubilair",
  keywords: [
    "kantoormeubilair",
    "projectinrichting",
    "kantoorinrichting",
    "bureaustoelen",
    "zit-sta bureaus",
    "vergadertafels",
    "akoestiek",
    "Weststrate",
    "Middelburg",
    "Zeeland",
  ],
  authors: [{ name: "Weststrate" }],
  creator: "Weststrate",
  publisher: "Weststrate",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "Weststrate Meubilair",
    title: TITEL,
    description: OMSCHRIJVING,
    images: [
      {
        url: "/beelden/hero-kantoor.png",
        alt: "Door Weststrate ingericht kantoor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITEL,
    description: OMSCHRIJVING,
    images: ["/beelden/hero-kantoor.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${nunito.variable} ${inter.variable}`}>
      <body>
        {/* Gestructureerde data: wie is Weststrate + het showroomadres. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organisatieJsonLd())}
        />
        {children}
      </body>
    </html>
  );
}
