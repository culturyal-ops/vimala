import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AppProviders } from "@/components/providers/AppProviders";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimalasilks.com"
  ),
  title: {
    default: "Vimala Silk House | Premium Silk Sarees & Bridal Wear, Kattappana",
    template: "%s | Vimala Silk House",
  },
  description:
    "Shop pure silk sarees, bridal collections & readymade fashion from Vimala Silk House, Kattappana. Trusted since generations. Worldwide shipping available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>
        <AppProviders>
          <Navbar />
          <main className="safe-bottom md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
