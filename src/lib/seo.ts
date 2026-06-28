import type { Metadata } from "next";

export const SITE_URL = "https://milliyprep.xyz";
export const SITE_NAME = "MilliyPrep";

export const SITE_DESCRIPTION =
  "MilliyPrep orqali Milliy Sertifikat imtihonlariga samarali tayyorlaning. Matematika, ona tili, tarix, huquq, ingliz tili va boshqa fanlar bo'yicha testlar, mavzular, natija tahlili va shaxsiy tayyorgarlik rejasi.";

export const SITE_POSITIONING =
  "MilliyPrep - Milliy Sertifikat imtihonlariga tayyorlanish uchun zamonaviy online platforma. Matematika, ona tili, tarix, huquq, ingliz tili va boshqa fanlar bo'yicha testlar, mavzulashtirilgan mashqlar, mock imtihonlar va progress tracking mavjud.";

export const SEO_KEYWORDS = [
  "Milliy Sertifikat",
  "Milliy Sertifikatga tayyorlash",
  "Milliy Sertifikat tayyorlov",
  "Milliy Sertifikat online kurs",
  "Milliy Sertifikat testlari",
  "Milliy Sertifikat mock imtihon",
  "Matematika Milliy Sertifikat",
  "Ona tili Milliy Sertifikat",
  "Tarix Milliy Sertifikat",
  "Huquq Milliy Sertifikat",
  "ingliz tili milliy sertifikat",
  "Biologiya Milliy Sertifikat",
  "Kimyo Milliy Sertifikat",
  "Fizika Milliy Sertifikat",
  "Geografiya Milliy Sertifikat",
  "AI tutor",
  "MilliyPrep",
];

export const ROUTES = [
  "",
  "/milliy-sertifikatga-tayyorlash",
  "/milliy-sertifikat-ingliz-tili",
  "/cefr-tayyorlov",
  "/about",
  "/blog",
  "/privacy",
  "/terms",
] as const;

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path}`;
}

export function pageMetadata({
  title,
  description,
  path = "",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS, ...keywords],
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: "website",
      locale: "uz_UZ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "Milliy Prep",
  url: SITE_URL,
  logo: absoluteUrl("/icon-512.png"),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Milliy Prep",
  url: SITE_URL,
  description:
    "MilliyPrep - Milliy Sertifikat imtihonlariga barcha asosiy fanlar bo'yicha tayyorlanish platformasi.",
};

export const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Milliy Sertifikatga tayyorlanish",
  description: SITE_POSITIONING,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    sameAs: SITE_URL,
  },
  teaches: [
    "Matematika",
    "Ona tili",
    "Tarix",
    "Huquq",
    "Ingliz tili",
    "Biologiya",
    "Kimyo",
    "Fizika",
    "Geografiya",
    "Mock imtihonlar",
    "Natija tahlili",
  ],
  inLanguage: "uz-Latn",
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "MilliyPrep qaysi imtihonga tayyorlaydi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MilliyPrep Milliy Sertifikat imtihonlariga tayyorlaydi. Matematika, ona tili, tarix, huquq, ingliz tili va boshqa asosiy fanlar bo'yicha testlar, mavzular, mock imtihonlar va natija tahlili mavjud.",
      },
    },
    {
      "@type": "Question",
      name: "Milliy Sertifikatga online tayyorlansa bo'ladimi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ha. Platformada shaxsiy o'quv reja, mini-testlar, mock testlar, natija tahlili va AI tutor yordamida online tayyorlanish mumkin.",
      },
    },
    {
      "@type": "Question",
      name: "Qaysi fanlar qo'llab-quvvatlanadi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Platformada Matematika, Ona tili, Tarix, Huquq, Ingliz tili, Biologiya, Kimyo, Fizika va Geografiya kabi asosiy Milliy Sertifikat fanlari yo'nalish sifatida ko'rsatilgan.",
      },
    },
  ],
};
