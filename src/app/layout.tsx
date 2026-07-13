import type { Metadata, Viewport } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import { SEO_KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  title: {
    default: "MilliyPrep — Milliy Sertifikatga tayyorlanish platformasi",
    template: "%s | MilliyPrep",
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  category: "education",
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
  openGraph: {
    title: "MilliyPrep — Milliy Sertifikatga tayyorlanish",
    description:
      "Barcha asosiy Milliy Sertifikat fanlari bo'yicha testlar, mavzular, mock imtihonlar va natija tahlili.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "uz_UZ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MilliyPrep — Milliy Sertifikatga tayyorlanish",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MilliyPrep — Milliy Sertifikatga tayyorlanish",
    description:
      "Milliy Sertifikat fanlari bo'yicha testlar, mavzular, mock imtihonlar va progress tracking.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${inter.variable} ${dancing.variable}`}>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
