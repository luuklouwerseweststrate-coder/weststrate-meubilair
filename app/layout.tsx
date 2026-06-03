import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Weststrate Meubilair — kantoormeubilair voor dealers",
    template: "%s · Weststrate Meubilair",
  },
  description:
    "Bureaustoelen, bureaus en vergadertafels van Weststrate. Stel je offerte zelf samen met de opties die je nodig hebt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${nunito.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
