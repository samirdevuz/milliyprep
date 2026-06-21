import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
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
  title: {
    default: "MilliyPrep — DTM va Milliy Sertifikatga aqlli tayyorgarlik",
    template: "%s · MilliyPrep",
  },
  description:
    "Sun'iy intellektga asoslangan shaxsiy o'quv reja, minglab mashq savollari va real imtihonga yaqin testlar. DTM va Milliy Sertifikat uchun bir joyda.",
  metadataBase: new URL("https://milliyprep.xyz"),
  openGraph: {
    title: "MilliyPrep — DTM va Milliy Sertifikatga aqlli tayyorgarlik",
    description:
      "Shaxsiy o'quv reja, minglab mashqlar, AI tutor. Maqsad — siz xohlagan ball.",
    type: "website",
    locale: "uz_UZ",
  },
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
