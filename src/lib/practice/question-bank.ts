import type { Question, Subject, Topic } from "./types";

export const SUBJECTS: Subject[] = [
  {
    id: "english",
    name: "Ingliz tili",
    description: "Listening, Reading, Writing va Speaking ko'nikmalari.",
    color: "brand",
    examWeight: 40,
    position: 1,
  },
  {
    id: "uzbek",
    name: "Ona tili",
    description: "Matn tahlili, imlo, uslub va til qoidalari.",
    color: "accent",
    examWeight: 25,
    position: 2,
  },
  {
    id: "russian",
    name: "Rus tili",
    description: "Matn, grammatika va kommunikativ vazifalar.",
    color: "sky",
    examWeight: 20,
    position: 3,
  },
  {
    id: "math",
    name: "Matematika",
    description: "100 ballik sertifikat formatidagi algebra va geometriya.",
    color: "amber",
    examWeight: 15,
    position: 4,
  },
];

export const TOPICS: Topic[] = [
  {
    id: "english-listening-gist",
    subjectId: "english",
    name: "Listening: asosiy fikr",
    description: "Audio vaziyat, maqsad va umumiy mazmunni aniqlash.",
    level: "easy",
    estimatedMinutes: 12,
    position: 1,
  },
  {
    id: "english-reading-detail",
    subjectId: "english",
    name: "Reading: dalil va detal",
    description: "Matndan aniq ma'lumot, sabab va xulosani topish.",
    level: "medium",
    estimatedMinutes: 18,
    position: 2,
  },
  {
    id: "english-writing-cohesion",
    subjectId: "english",
    name: "Writing: bog'lovchilar",
    description: "Fikrlarni izchil ulash va rasmiy uslubni tanlash.",
    level: "medium",
    estimatedMinutes: 16,
    position: 3,
  },
  {
    id: "english-speaking-response",
    subjectId: "english",
    name: "Speaking: javob tuzish",
    description: "Savolga to'liq, asoslangan va tabiiy javob berish.",
    level: "medium",
    estimatedMinutes: 14,
    position: 4,
  },
  {
    id: "uzbek-text-analysis",
    subjectId: "uzbek",
    name: "Matn tahlili",
    description: "Asosiy fikr, muallif pozitsiyasi va dalillar.",
    level: "medium",
    estimatedMinutes: 16,
    position: 1,
  },
  {
    id: "uzbek-spelling-style",
    subjectId: "uzbek",
    name: "Imlo va uslub",
    description: "Adabiy me'yor, uslubiy xato va to'g'ri yozuv.",
    level: "easy",
    estimatedMinutes: 12,
    position: 2,
  },
  {
    id: "russian-reading-grammar",
    subjectId: "russian",
    name: "Rus tili: matn va grammatika",
    description: "Kontekst, kelishik va gap tuzilishini tanlash.",
    level: "medium",
    estimatedMinutes: 18,
    position: 1,
  },
  {
    id: "math-certificate-core",
    subjectId: "math",
    name: "Matematika: bazaviy blok",
    description: "Sertifikat testlarida uchraydigan algebraik masalalar.",
    level: "medium",
    estimatedMinutes: 20,
    position: 1,
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "q-en-listening-gist-1",
    subjectId: "english",
    topicId: "english-listening-gist",
    prompt:
      "Listening vazifasida speaker: 'I used to take the bus, but cycling saves me time and keeps me active.' Asosiy fikr qaysi?",
    options: [
      "U avtobusda yurishni afzal ko'radi",
      "Velosiped unga vaqt va sog'liq jihatdan foydali",
      "U sport zaliga borishni boshlagan",
      "U yo'l harakatidan shikoyat qilmoqda",
    ],
    correctIndex: 1,
    explanation:
      "Speaker velosiped vaqt tejashi va faol bo'lishga yordam berishini aytmoqda.",
    difficulty: "easy",
  },
  {
    id: "q-en-listening-gist-2",
    subjectId: "english",
    topicId: "english-listening-gist",
    prompt:
      "Mini-dialog: 'The lecture starts at nine, not nine-thirty. We should leave earlier.' Speaker nimani ta'kidlayapti?",
    options: [
      "Dars bekor qilingan",
      "Boshlanish vaqti avval o'ylanganidan ertaroq",
      "Ular kechroq chiqishi kerak",
      "Manzil o'zgargan",
    ],
    correctIndex: 1,
    explanation:
      "'Not nine-thirty' va 'leave earlier' iboralari vaqt ertaroq ekanini ko'rsatadi.",
    difficulty: "easy",
  },
  {
    id: "q-en-reading-detail-1",
    subjectId: "english",
    topicId: "english-reading-detail",
    prompt:
      "Matn: 'Applicants must upload their ID before Friday. Late files will not be reviewed.' Qaysi xulosa to'g'ri?",
    options: [
      "ID juma kunidan oldin yuklanishi kerak",
      "Hujjatni istalgan vaqtda topshirish mumkin",
      "Faqat kechikkan fayllar tekshiriladi",
      "ID o'rniga pasport rasmi kerak",
    ],
    correctIndex: 0,
    explanation:
      "'Before Friday' muddati va 'late files will not be reviewed' ogohlantirishi shuni bildiradi.",
    difficulty: "medium",
  },
  {
    id: "q-en-reading-detail-2",
    subjectId: "english",
    topicId: "english-reading-detail",
    prompt:
      "The word 'however' in a reading passage usually signals what relationship?",
    options: ["Cause", "Contrast", "Example", "Sequence"],
    correctIndex: 1,
    explanation: "'However' qarama-qarshi fikr yoki burilishni bildiradi.",
    difficulty: "easy",
  },
  {
    id: "q-en-writing-cohesion-1",
    subjectId: "english",
    topicId: "english-writing-cohesion",
    prompt:
      "Rasmiy writing uchun qaysi bog'lovchi sabab-natijani eng aniq beradi?",
    options: ["because of this", "anyway", "you know", "stuff like that"],
    correctIndex: 0,
    explanation:
      "'Because of this' rasmiyroq va sabab-natija aloqasini aniq ko'rsatadi.",
    difficulty: "medium",
  },
  {
    id: "q-en-writing-cohesion-2",
    subjectId: "english",
    topicId: "english-writing-cohesion",
    prompt:
      "Writing javobida 'Firstly, ... Secondly, ... Finally, ...' tuzilmasi nimaga xizmat qiladi?",
    options: [
      "So'z sonini kamaytirishga",
      "Fikrlarni tartibli ko'rsatishga",
      "Faqat norasmiy uslub yaratishga",
      "Grammatikani tekshirmaslikka",
    ],
    correctIndex: 1,
    explanation:
      "Bunday markerlar javobning mantiqiy oqimini va tartibini kuchaytiradi.",
    difficulty: "easy",
  },
  {
    id: "q-en-speaking-response-1",
    subjectId: "english",
    topicId: "english-speaking-response",
    prompt:
      "Speaking savoli: 'Do you prefer studying alone or with classmates?' Eng kuchli javob boshlanishi qaysi?",
    options: [
      "Yes.",
      "I don't know.",
      "I prefer studying with classmates because we can explain difficult points to each other.",
      "Classmates.",
    ],
    correctIndex: 2,
    explanation:
      "Javob pozitsiya va sababni beradi, shuning uchun speaking mezonlariga mosroq.",
    difficulty: "medium",
  },
  {
    id: "q-en-speaking-response-2",
    subjectId: "english",
    topicId: "english-speaking-response",
    prompt:
      "Speakingda javobni kengaytirish uchun qaysi usul eng foydali?",
    options: [
      "Faqat bitta so'z aytish",
      "Fikr + sabab + qisqa misol berish",
      "Savolni takrorlab jim turish",
      "Faqat yodlangan iboralarni aytish",
    ],
    correctIndex: 1,
    explanation:
      "Fikr, sabab va misol javobni mazmunli va baholashga qulay qiladi.",
    difficulty: "medium",
  },
  {
    id: "q-uz-text-1",
    subjectId: "uzbek",
    topicId: "uzbek-text-analysis",
    prompt:
      "Matnda muallif avval muammoni aytib, keyin ikki dalil keltirsa, bu dalillar nimaga xizmat qiladi?",
    options: [
      "Matnni cho'zishga",
      "Asosiy fikrni isbotlashga",
      "Sarlavhani almashtirishga",
      "Uslubni buzishga",
    ],
    correctIndex: 1,
    explanation:
      "Dalil asosiy fikr yoki muallif pozitsiyasini asoslash uchun ishlatiladi.",
    difficulty: "easy",
  },
  {
    id: "q-uz-text-2",
    subjectId: "uzbek",
    topicId: "uzbek-text-analysis",
    prompt:
      "Qaysi javob matnning asosiy fikrini topishga eng ko'p yordam beradi?",
    options: [
      "Eng uzun gapni ko'chirish",
      "Matn nimani isbotlamoqchi ekanini aniqlash",
      "Faqat birinchi so'zni o'qish",
      "Tinish belgilarini sanash",
    ],
    correctIndex: 1,
    explanation:
      "Asosiy fikr matnning bosh mazmuni va muallif yetkazmoqchi bo'lgan g'oyadir.",
    difficulty: "medium",
  },
  {
    id: "q-uz-style-1",
    subjectId: "uzbek",
    topicId: "uzbek-spelling-style",
    prompt: "Qaysi gap adabiy uslubga mosroq?",
    options: [
      "Men ertaga imtihonga tayyorgarlik ko'raman.",
      "Man ertaga ekzaminga tayyorlanvoman.",
      "Ertaga man test qivoman.",
      "Imtihonga unaqa-bunaqa qaraymiz.",
    ],
    correctIndex: 0,
    explanation:
      "Birinchi gap adabiy me'yor va rasmiyroq uslubga mos.",
    difficulty: "easy",
  },
  {
    id: "q-uz-style-2",
    subjectId: "uzbek",
    topicId: "uzbek-spelling-style",
    prompt: "Qaysi so'z to'g'ri yozilgan?",
    options: ["xohlagan", "hohlagan", "xoxlagan", "hoh-lagan"],
    correctIndex: 0,
    explanation: "Adabiy imlo bo'yicha to'g'ri shakl: xohlagan.",
    difficulty: "easy",
  },
  {
    id: "q-ru-reading-1",
    subjectId: "russian",
    topicId: "russian-reading-grammar",
    prompt: "Выберите правильный вариант: 'Я интересуюсь ____.'",
    options: ["история", "истории", "историей", "историю"],
    correctIndex: 2,
    explanation:
      "Fe'l 'интересоваться' творительный kelishigini talab qiladi: историей.",
    difficulty: "medium",
  },
  {
    id: "q-ru-reading-2",
    subjectId: "russian",
    topicId: "russian-reading-grammar",
    prompt:
      "Matnda 'несмотря на это' birikmasi odatda qanday ma'noni bildiradi?",
    options: ["Sabab", "Qarama-qarshilik", "Joy", "Sanash"],
    correctIndex: 1,
    explanation:
      "'Несмотря на это' oldingi fikrga zid yoki kutilmagan natijani bildiradi.",
    difficulty: "medium",
  },
  {
    id: "q-math-core-1",
    subjectId: "math",
    topicId: "math-certificate-core",
    prompt:
      "Milliy Sertifikat matematika blokida 2x + 9 = 25 bo'lsa, x nechaga teng?",
    options: ["6", "8", "12", "17"],
    correctIndex: 1,
    explanation: "2x = 25 - 9 = 16, demak x = 8.",
    difficulty: "easy",
  },
  {
    id: "q-math-core-2",
    subjectId: "math",
    topicId: "math-certificate-core",
    prompt:
      "Agar testda 40 savoldan 30 tasi to'g'ri bo'lsa, foiz natija nechaga teng?",
    options: ["60%", "70%", "75%", "80%"],
    correctIndex: 2,
    explanation: "30 / 40 = 0.75, ya'ni 75%.",
    difficulty: "easy",
  },
];

export function publicQuestion(question: Question) {
  return {
    id: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId,
    prompt: question.prompt,
    options: question.options,
    difficulty: question.difficulty,
  };
}
