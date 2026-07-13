"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";

const FAQS = [
  {
    q: "MilliyPrep qaysi imtihonlarga tayyorlaydi?",
    a: "Platforma faqat Milliy Sertifikat tayyorgarligiga qaratilgan. Fan va mavzular bo'yicha mashqlar, savol bankidan shakllanadigan mock testlar va natija tahlili mavjud.",
  },
  {
    q: "Boshlash uchun nima kerak?",
    a: "Hisob yarating va qisqa onboarding savollariga javob bering: tanlagan faningiz, hozirgi natijangiz, maqsad ballingiz va haftalik o'qish vaqtingiz haqida. Shundan keyin sizga tayyor reja taqdim etiladi.",
  },
  {
    q: "Reja qanday shakllanadi?",
    a: "Profilingizdagi maqsad va vaqt saqlanadi. Mashq natijalariga ko'ra aniqligi pastroq mavzular tavsiya navbatida yuqoriga chiqadi, haftalik progress esa dashboardda yangilanadi.",
  },
  {
    q: "Pro tarifda nimalar bor?",
    a: "Pro tarifda mock testlar, profil kontekstidagi AI tutor, mavzuli savol banki, natijalar tarixi va kuchli-zaif mavzular tahlili mavjud.",
  },
  {
    q: "Qanday tillarda ishlaydi?",
    a: "Asosiy interfeys o'zbek lotin tilida. AI tutor ham o'zbekcha javob beradi; mashq matni esa tanlangan fan mazmuniga bog'liq.",
  },
  {
    q: "Telefonda ham ishlaydimi?",
    a: "Ha, sayt telefon, planshet va kompyuter ekranlariga moslashadi. Alohida mobil ilova talab qilinmaydi.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-ink-50/40 py-20 lg:py-24">
      <div className="container-page max-w-3xl">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Tez-tez beriladigan savollar
            </h2>
            <p className="mt-3 text-ink-600">
              Javob topa olmadingizmi? Telegram orqali yozing — yordam beramiz.
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 40} as="li">
                <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-ink-100">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-ink-900 sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-ink-500 transition-transform",
                        isOpen && "rotate-180 text-brand-600"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-200",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
