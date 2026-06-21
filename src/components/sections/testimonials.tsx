import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { STUDENT_AVATARS } from "@/lib/avatars";

interface Testimonial {
  before: string;
  after: string;
  quote: string;
  name: string;
  city: string;
  target: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    before: "115",
    after: "175",
    quote:
      "Bir yil mustaqil tayyorlanib charchadim. MilliyPrep aniq qaysi mavzuni qayta ko'rishim kerakligini ko'rsatdi va ikki oyda 60 ball o'sdim.",
    name: "Jasurbek Ergashev",
    city: "Toshkent",
    target: "DTM · Iqtisodiyot",
    avatar: STUDENT_AVATARS.jasurbek,
  },
  {
    before: "B1",
    after: "C1",
    quote:
      "Milliy sertifikat uchun har kuni 30 daqiqada mashq qildim. AI tutor xato qilgan joylarimni darhol tushuntirdi.",
    name: "Madina Karimova",
    city: "Samarqand",
    target: "Milliy sertifikat · Ingliz tili",
    avatar: STUDENT_AVATARS.madina,
  },
  {
    before: "98",
    after: "168",
    quote:
      "Maktabda matematikadan qiynalardim. Mashqlar bo'limi va statistika orqali eng zaif mavzularni topib, takrorlab chiqdim.",
    name: "Doniyor Tursunov",
    city: "Farg'ona",
    target: "DTM · Muhandislik",
    avatar: STUDENT_AVATARS.doniyor,
  },
  {
    before: "A2",
    after: "B2",
    quote:
      "Onlayn darslar charchatardi. Bu yerda har kuni 15 daqiqalik mashq yetarli bo'ldi. Streak meni ushlab turdi.",
    name: "Yulduz Abdullayeva",
    city: "Buxoro",
    target: "Milliy sertifikat · Rus tili",
    avatar: STUDENT_AVATARS.yulduz,
  },
  {
    before: "120",
    after: "168",
    quote:
      "Mock testlarda bir necha marta o'tirib ko'rdim. Imtihon kuni o'sha hayajondan asar ham qolmadi.",
    name: "Saidkamol Yo'ldoshev",
    city: "Andijon",
    target: "DTM · Tibbiyot",
    avatar: STUDENT_AVATARS.saidkamol,
  },
  {
    before: "70",
    after: "152",
    quote:
      "Asl o'zgarish — har kuni o'sha tekis kichik mashqlardan keldi. Reja meni tashlab ketmadi.",
    name: "Nilufar Sharipova",
    city: "Namangan",
    target: "DTM · Filologiya",
    avatar: STUDENT_AVATARS.nilufar,
  },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full w-[320px] shrink-0 flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-100">
      <div className="flex items-center gap-2 text-sm font-bold">
        <span className="rounded-md bg-ink-100 px-2 py-0.5 text-ink-700">
          {t.before}
        </span>
        <span className="text-ink-400">→</span>
        <span className="rounded-md bg-accent-100 px-2 py-0.5 text-accent-700">
          {t.after}
        </span>
      </div>
      <Quote className="mt-4 h-5 w-5 text-brand-300" aria-hidden="true" />
      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">
        {t.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
        <Avatar src={t.avatar} alt={t.name} size={40} />
        <div>
          <p className="text-sm font-semibold text-ink-900">{t.name}</p>
          <p className="text-xs text-ink-500">
            {t.city} · {t.target}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  // Split into two rows for a richer marquee.
  const rowA = TESTIMONIALS.slice(0, 3);
  const rowB = TESTIMONIALS.slice(3);

  return (
    <section id="natijalar" className="overflow-hidden py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              O&apos;quvchilarning <span className="accent-word text-[1.1em]">so&apos;zlari</span> va natijalari
            </h2>
            <p className="mt-3 text-ink-600">
              MilliyPrepga ishongan o&apos;quvchilarning haqiqiy tajribasi.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Marquee rows */}
      <div className="pause-on-hover relative mt-12 space-y-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24"
        />

        <div className="flex w-max gap-5">
          <div className="marquee-track flex gap-5">
            {[...rowA, ...rowA].map((t, i) => (
              <Card key={`a-${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>

        <div className="flex w-max gap-5">
          <div className="marquee-track flex gap-5 [animation-duration:36s] [animation-direction:reverse]">
            {[...rowB, ...rowB].map((t, i) => (
              <Card key={`b-${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
