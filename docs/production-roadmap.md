# MilliyPrep Production Roadmap

## Maqsad

MilliyPrep'ni real foydalanuvchi, real to'lov va real Milliy Sertifikat kontenti
bilan ishonchli ishlaydigan mahsulotga aylantirish. Har bir bosqich test,
monitoring yoki operatsion dalil bilan yopiladi.

## 1. Platforma yaxlitligi — bajarildi

- Practice natijasi serverdagi faol savollardan qayta hisoblanadi.
- Noto'g'ri, takrorlangan yoki qisqartirilgan javob to'plami rad etiladi.
- Supabase va fallback kataloglari bir xil progress modelidan foydalanadi.
- Katalog ID migratsiyasi va ma'lumotlar bazasi cheklovlari qo'shildi.
- Unit testlar `npm test` tarkibiga kiritildi.

## 2. Auth va onboarding — bajarildi

- Onboarding faqat ruxsat etilgan Milliy Sertifikat maydonlari bilan saqlanadi.
- Email, telefon, Telegram va Google oqimlarida profil yo'qolmaydi.
- Google OAuth uchun qisqa muddatli HTTP-only kontekst ishlatiladi.
- Ichki bo'lmagan `next` manzillar bloklanadi.

## 3. To'lov va Pro huquqi — kod tayyor, provider tasdig'i kutiladi

- Checkout faqat login qilingan foydalanuvchi uchun order yaratadi.
- Click/Payme muvaffaqiyatli callbacki Pro obunani atomik faollashtiradi.
- Bir callback takror yuborilsa, obuna muddati ikkinchi marta uzaymaydi.
- Bekor qilish faol orderdan kelgan huquqni yopadi.
- Productionda AI tutor va mock test Pro huquqni tekshiradi.

Qabul mezoni: Click va Payme sandboxlarida alohida test akkauntlar bilan
to'lash, takroriy callback, xato summa va cancel ssenariylari yozib olinadi.

## 4. Kontent va mahsulot va'dasi — davom etmoqda

- Landingdagi tekshirilmagan ijtimoiy raqamlar va mavjud bo'lmagan funksiyalar
  olib tashlandi.
- Dastlabki savol katalogi Milliy Sertifikat ekspertlari bilan tekshiriladi.
- Har bir fan uchun manba, muallif, reviewer va versiya metadatasi qo'shiladi.
- Rasmiy formatga yaqinlik faqat ekspert tasdig'idan keyin reklama qilinadi.

Qabul mezoni: launch qilinadigan har bir fan uchun tasdiqlangan blueprint va
kamida bitta to'liq sifat tekshiruvidan o'tgan mock variant mavjud bo'ladi.

## 5. Ishonchlilik va xavfsizlik — davom etmoqda

- Supabase RPC asosida distributed rate limit — bajarildi.
- GitHub Actions: test, audit, build va HTTP smoke — bajarildi.
- Auth, payment va admin oqimlari uchun browser E2E testlari.
- CSP/security headers va webhook replay monitoring.
- Sentry yoki OpenTelemetry orqali error, latency va callback alertlari.
- Supabase backup restore drill va incident runbook.

Qabul mezoni: stagingda E2E yashil, payment alertlari ishlaydi, backup yangi
loyihaga tiklanadi va P0 incident runbook sinovdan o'tadi.

## 6. Launch gate

- Production env tekshiruvi va secret rotation.
- Google, Resend, Telegram, Click va Payme production callback tasdiqlari.
- Privacy/terms, support kanali, refund va cancellation jarayoni.
- Mobil/desktop smoke QA, accessibility va performance budjeti.
- Bosqichli rollout: ichki test → 20 foydalanuvchi → 100 foydalanuvchi → public.
