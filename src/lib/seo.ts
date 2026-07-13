import type { Metadata } from "next";

export const SITE_URL = "https://milliyprep.xyz";
export const SITE_NAME = "MilliyPrep";

export const SITE_DESCRIPTION =
  "MilliyPrep orqali Milliy Sertifikat imtihonlariga samarali tayyorlaning. Matematika, ona tili, tarix, huquq, ingliz tili va boshqa fanlar bo'yicha testlar, mavzular, natija tahlili va shaxsiy tayyorgarlik rejasi.";

export const SITE_POSITIONING =
  "MilliyPrep - Milliy Sertifikat imtihonlariga tayyorlanish uchun zamonaviy online platforma. Matematika, ona tili, tarix, huquq, ingliz tili va boshqa fanlar bo'yicha testlar, mavzulashtirilgan mashqlar, mock imtihonlar va progress tracking mavjud.";

export const SEO_KEYWORDS = [
  "MilliyPrep",
  "Milliy Prep",
  "milliyprep",
  "milliyprep xyz",
  "milliyprep.uz",
  "Milliy Sertifikat",
  "Milliy sertifikat",
  "milliy sertifikat",
  "Milliy Sertifikat imtihoni",
  "Milliy Sertifikatga tayyorlanish",
  "Milliy Sertifikatga tayyorlash",
  "Milliy Sertifikat tayyorgarlik",
  "Milliy Sertifikat tayyorlov",
  "Milliy Sertifikat platformasi",
  "Milliy Sertifikat online kurs",
  "Milliy Sertifikat online tayyorlov",
  "Milliy Sertifikat online tayyorlanish",
  "Milliy Sertifikat uchun testlar",
  "Milliy Sertifikat testlari",
  "Milliy Sertifikat test yechish",
  "Milliy Sertifikat savollari",
  "Milliy Sertifikat mavzulari",
  "Milliy Sertifikat mock test",
  "Milliy Sertifikat mock imtihon",
  "Milliy Sertifikat sinov testi",
  "Milliy Sertifikat diagnostika",
  "Milliy Sertifikat natija tahlili",
  "Milliy Sertifikat shaxsiy reja",
  "Milliy Sertifikat AI tutor",
  "Milliy Sertifikat o'quv reja",
  "Milliy Sertifikat 100 ball",
  "Milliy Sertifikat ball tahlili",
  "Milliy Sertifikat progress tracking",
  "O'zbekistonda Milliy Sertifikat tayyorlov",
  "O'zbekiston Milliy Sertifikat",
  "Matematika Milliy Sertifikat",
  "Matematika Milliy Sertifikat testlari",
  "Matematika Milliy Sertifikat tayyorlov",
  "Matematika Milliy Sertifikat mock test",
  "Matematika milliy sertifikatga tayyorlanish",
  "Ona tili Milliy Sertifikat",
  "Ona tili Milliy Sertifikat testlari",
  "Ona tili Milliy Sertifikat tayyorlov",
  "Ona tili milliy sertifikatga tayyorlanish",
  "Ona tili va adabiyot Milliy Sertifikat",
  "Tarix Milliy Sertifikat",
  "Tarix Milliy Sertifikat testlari",
  "Tarix Milliy Sertifikat tayyorlov",
  "Tarix milliy sertifikatga tayyorlanish",
  "Huquq Milliy Sertifikat",
  "Huquq Milliy Sertifikat testlari",
  "Huquq Milliy Sertifikat tayyorlov",
  "Huquq milliy sertifikatga tayyorlanish",
  "Ingliz tili Milliy Sertifikat",
  "ingliz tili milliy sertifikat",
  "Ingliz tili Milliy Sertifikat testlari",
  "Ingliz tili Milliy Sertifikat tayyorlov",
  "Ingliz tili milliy sertifikatga tayyorlanish",
  "Rus tili Milliy Sertifikat",
  "Rus tili Milliy Sertifikat testlari",
  "Rus tili Milliy Sertifikat tayyorlov",
  "Biologiya Milliy Sertifikat",
  "Biologiya Milliy Sertifikat testlari",
  "Biologiya Milliy Sertifikat tayyorlov",
  "Biologiya milliy sertifikatga tayyorlanish",
  "Kimyo Milliy Sertifikat",
  "Kimyo Milliy Sertifikat testlari",
  "Kimyo Milliy Sertifikat tayyorlov",
  "Kimyo milliy sertifikatga tayyorlanish",
  "Fizika Milliy Sertifikat",
  "Fizika Milliy Sertifikat testlari",
  "Fizika Milliy Sertifikat tayyorlov",
  "Fizika milliy sertifikatga tayyorlanish",
  "Geografiya Milliy Sertifikat",
  "Geografiya Milliy Sertifikat testlari",
  "Geografiya Milliy Sertifikat tayyorlov",
  "Geografiya milliy sertifikatga tayyorlanish",
  "Milliy Sertifikat fanlari",
  "Milliy Sertifikat asosiy fanlar",
  "Milliy Sertifikat mavzulashtirilgan testlar",
  "mavzuli testlar",
  "online test platforma",
  "imtihonga online tayyorlanish",
  "testlar va mavzular",
  "mock imtihonlar",
  "natija tahlili",
  "shaxsiy tayyorgarlik rejasi",
  "AI yordamchi",
  "AI tutor",
  "ta'lim platformasi",
  "online ta'lim",
  "imtihon tayyorgarligi",
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
    "MilliyPrep - Milliy Sertifikat uchun profil, mavzuli mashqlar, mock testlar, progress tahlili va AI tutor platformasi.",
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
