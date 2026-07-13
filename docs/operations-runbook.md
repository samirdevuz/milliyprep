# MilliyPrep Operations Runbook

## Kuzatiladigan signallar

- `GET /api/health`: 200 bo'lmasa database yoki migratsiya muammosi.
- `request.failed`: Next.js ushlagan server xatosi.
- `payment.callback`: Click/Payme prepare, paid yoki canceled hodisasi.
- `payment.callback_rejected`: noto'g'ri provider autentifikatsiyasi.
- `rate_limit.blocked`: bir xil hash bucket bo'yicha limit oshgan.
- `health.database_failed`: Supabase query ishlamagan.

Hosting log drain JSON qatorlarni `event` maydoni bo'yicha indekslashi kerak.
Loglarda email, telefon, onboarding yoki payment secret saqlanmaydi.

## Tavsiya etilgan alertlar

- `/api/health` ketma-ket 3 marta 503: P1.
- `request.failed` 5 daqiqada 10 tadan ko'p: P1.
- `payment.callback_rejected` 5 daqiqada 5 tadan ko'p: P1/security.
- Paid callback kelib, `/api/payments/status` active bo'lmasa: P0.
- `rate_limit.blocked` birdan 10 baravar oshsa: P2 yoki hujum tekshiruvi.

## Payment incident

1. Provider, `orderId` va `providerTransactionId`ni logdan oling.
2. `payment_orders` statusi, summa, provider va user_idni tekshiring.
3. `subscription_activations`da order mavjudligini tekshiring.
4. `subscriptions`dagi period va `source_order_id`ni tekshiring.
5. Callbackni qo'lda qayta yuborishdan oldin provider dashboardidagi holatni
   tasdiqlang. Aktivatsiya idempotent, lekin faqat haqiqiy callback qaytariladi.
6. Refund/cancel providerda bajarilgach callback natijasini tekshiring.

## Database va migratsiya incidenti

1. Public trafikni yoki checkoutni vaqtincha to'xtating.
2. Oxirgi muvaffaqiyatli migratsiya raqamini aniqlang.
3. Yangi migrationni avval staging clone'da bajaring.
4. `npm run test:smoke` orqali readinessni tekshiring.
5. Rollback SQL bo'lmasa, eski deployni qaytarish schema o'zgarishini bekor
   qilmasligini hisobga oling.

## Backup restore drill

Har oy:

1. Supabase backupni yangi yopiq projectga tiklang.
2. `001`–`006` schema obyektlari va row countlarni solishtiring.
3. Bitta test user, practice attempt, paid order va subscriptionni tekshiring.
4. Tiklangan projectda `npm run test:smoke` ishlating.
5. Restore vaqti, data yo'qotish oynasi va topilgan muammolarni yozib qo'ying.

## Rate-limit parvarishi

Kuniga bir marta service-role orqali quyidagini ishga tushiring:

```sql
select public.prune_rate_limit_buckets();
```

Supabase Cron ishlatilsa, shu funksiya uchun daily job yarating. Funksiya faqat
bir kundan eski, muddati tugagan bucketlarni o'chiradi.
