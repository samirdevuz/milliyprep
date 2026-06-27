import type { Metadata } from "next";

export const SITE_URL = "https://milliyprep.xyz";
export const SITE_NAME = "MilliyPrep";

export const SITE_DESCRIPTION =
  "Milliy Sertifikatga tayyorlash platformasi: CEFR B1, B2 va C1 darajalari uchun shaxsiy reja, listening, reading, writing, speaking mashqlari, mock testlar va AI tutor.";

export const SEO_KEYWORDS = [
  "Milliy Sertifikat",
  "Milliy Sertifikatga tayyorlash",
  "Milliy Sertifikat tayyorlov",
  "Milliy Sertifikat online kurs",
  "CEFR tayyorlov",
  "CEFR B1 tayyorlash",
  "CEFR B2 tayyorlash",
  "CEFR C1 tayyorlash",
  "ingliz tili milliy sertifikat",
  "milliy sertifikat mock test",
  "listening reading writing speaking mashqlar",
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
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/icon.png"),
  sameAs: ["https://t.me/milliyprep", "https://instagram.com/milliyprep"],
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "Country",
    name: "Uzbekistan",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "uz-Latn",
};

export const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Milliy Sertifikatga tayyorlash",
  description:
    "CEFR B1, B2 va C1 darajalari uchun Milliy Sertifikat imtihoniga online tayyorlov: shaxsiy reja, to'rt ko'nikma mashqlari, mock test va AI tutor.",
  provider: {
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    sameAs: SITE_URL,
  },
  educationalLevel: ["B1", "B2", "C1"],
  teaches: [
    "Listening",
    "Reading",
    "Writing",
    "Speaking",
    "Grammar",
    "Vocabulary",
    "CEFR exam strategy",
  ],
  inLanguage: ["uz-Latn", "en", "ru"],
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
        text: "MilliyPrep Milliy Sertifikat imtihoniga tayyorlaydi: CEFR B1, B2 va C1 darajalari, listening, reading, writing va speaking ko'nikmalari bo'yicha mashqlar mavjud.",
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
      name: "Qaysi CEFR darajalari qo'llab-quvvatlanadi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MilliyPrep B1, B2 va C1 maqsadlari uchun reja va mashqlarni moslashtiradi.",
      },
    },
  ],
};
