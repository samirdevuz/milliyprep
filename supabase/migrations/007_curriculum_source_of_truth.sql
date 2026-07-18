-- Canonical Milliy Sertifikat curriculum snapshot (2026.07.1).
-- Archives the generic demo bank and publishes the reviewed Matematika pilot.

create table if not exists public.curriculum_sources (
  id text primary key,
  title text not null,
  publisher text not null,
  url text not null,
  version text not null,
  retrieved_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subjects
  add column if not exists status text not null default 'archived'
    check (status in ('draft', 'published', 'archived'));

alter table public.topics
  add column if not exists status text not null default 'archived'
    check (status in ('draft', 'published', 'archived')),
  add column if not exists exam_share integer
    check (exam_share is null or exam_share between 0 and 100),
  add column if not exists source_id text;

alter table public.questions
  add column if not exists status text not null default 'archived'
    check (status in ('draft', 'review', 'published', 'archived')),
  add column if not exists source_id text,
  add column if not exists origin text not null default 'original'
    check (origin in ('official', 'original'));

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'topics_source_id_fkey'
  ) then
    alter table public.topics
      add constraint topics_source_id_fkey
      foreign key (source_id) references public.curriculum_sources(id);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'questions_source_id_fkey'
  ) then
    alter table public.questions
      add constraint questions_source_id_fkey
      foreign key (source_id) references public.curriculum_sources(id);
  end if;
end
$$;

drop trigger if exists curriculum_sources_set_updated_at on public.curriculum_sources;
create trigger curriculum_sources_set_updated_at
before update on public.curriculum_sources
for each row execute function public.set_updated_at();

alter table public.curriculum_sources enable row level security;
revoke all on table public.curriculum_sources from anon, authenticated;

insert into public.curriculum_sources (
  id, title, publisher, url, version, retrieved_at
)
values
  (
    'uzbmb-math-spec-2024',
    'Matematika fanidan Milliy test tizimi spetsifikatsiyasi',
    'Bilim va malakalarni baholash agentligi',
    'https://www.uzbmb.uz/upload/file/pdf/mtt/spetsifikatsiya/Matematika_2024.pdf',
    '2024',
    '2026-07-13'
  ),
  (
    'uzbmb-math-sample',
    'Matematika fanidan namunaviy test topshiriqlari',
    'Bilim va malakalarni baholash agentligi',
    'https://www.uzbmb.uz/upload/file/pdf/milliytest/matem.pdf',
    'official-sample',
    '2026-07-13'
  )
on conflict (id) do update set
  title = excluded.title,
  publisher = excluded.publisher,
  url = excluded.url,
  version = excluded.version,
  retrieved_at = excluded.retrieved_at;

update public.questions set status = 'archived';
update public.topics set status = 'archived';
update public.subjects set status = 'archived';

insert into public.subjects (
  id, name, description, color, exam_weight, position, status
)
values (
  'math',
  'Matematika',
  'Algebra, funksiyalar, geometriya va ehtimollik.',
  'brand',
  100,
  1,
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  exam_weight = excluded.exam_weight,
  position = excluded.position,
  status = excluded.status;

insert into public.topics (
  id, subject_id, name, description, level, estimated_minutes,
  exam_share, source_id, position, status
)
values
  ('math-numbers-algebra', 'math', 'Sonlar va algebraik ifodalar', 'Sonlar, foiz, nisbat, ifodalarni almashtirish va soddalashtirish.', 'medium', 18, 30, 'uzbmb-math-spec-2024', 1, 'published'),
  ('math-equations-functions', 'math', 'Tenglamalar va funksiyalar', 'Tenglama, tengsizlik, progressiya, funksiya va grafiklar.', 'medium', 22, 30, 'uzbmb-math-spec-2024', 2, 'published'),
  ('math-geometry', 'math', 'Geometriya', 'Planimetriya, koordinatalar va fazoviy tasavvur.', 'medium', 20, 25, 'uzbmb-math-spec-2024', 3, 'published'),
  ('math-probability-data', 'math', 'Ehtimollik va ma''lumotlar', 'To''plam, kombinatorika, ehtimollik va statistik ko''rsatkichlar.', 'medium', 16, 15, 'uzbmb-math-spec-2024', 4, 'published')
on conflict (id) do update set
  subject_id = excluded.subject_id,
  name = excluded.name,
  description = excluded.description,
  level = excluded.level,
  estimated_minutes = excluded.estimated_minutes,
  exam_share = excluded.exam_share,
  source_id = excluded.source_id,
  position = excluded.position,
  status = excluded.status;

insert into public.questions (
  id, subject_id, topic_id, prompt, options, correct_index, explanation,
  difficulty, source_id, origin, position, status
)
values
  ('math-na-01', 'math', 'math-numbers-algebra', 'a va b natural sonlar uchun a · b = 24. a + 2b ifodaning eng kichik qiymatini toping.', jsonb_build_array('12', '14', '16', '18'), 1, '24 ning natural ko''paytuvchi juftlarini tekshiramiz. a = 6, b = 4 yoki a = 8, b = 3 bo''lganda ifoda 14 ga teng bo''ladi.', 'medium', 'uzbmb-math-spec-2024', 'original', 1, 'published'),
  ('math-na-02', 'math', 'math-numbers-algebra', '240 soni avval 25% ga oshirildi, keyin hosil bo''lgan son 20% ga kamaytirildi. Yakuniy natijani toping.', jsonb_build_array('230', '240', '250', '260'), 1, '240 · 1,25 = 300, so''ng 300 · 0,8 = 240.', 'easy', 'uzbmb-math-spec-2024', 'original', 2, 'published'),
  ('math-na-03', 'math', 'math-numbers-algebra', 'x ≠ 3 bo''lsa, (x² − 9) / (x − 3) ifodani soddalashtiring.', jsonb_build_array('x − 3', 'x + 3', 'x² + 3', '1'), 1, 'x² − 9 = (x − 3)(x + 3). x ≠ 3 shartida x − 3 qisqaradi.', 'easy', 'uzbmb-math-spec-2024', 'original', 3, 'published'),
  ('math-na-04', 'math', 'math-numbers-algebra', 'Bir mahsulot narxi 160 000 so''m. 15% chegirmadan keyingi narx qancha bo''ladi?', jsonb_build_array('124 000 so''m', '132 000 so''m', '136 000 so''m', '144 000 so''m'), 2, 'Chegirma 24 000 so''m. Yakuniy narx 136 000 so''m.', 'easy', 'uzbmb-math-spec-2024', 'original', 4, 'published'),
  ('math-ef-01', 'math', 'math-equations-functions', 'Arifmetik progressiyada a₅ + a₇ = 22 va a₁₀ + a₁₂ = 42. a₆ + a₁₁ ni toping.', jsonb_build_array('28', '30', '32', '34'), 2, 'a₅ + a₇ = 2a₆ dan a₆ = 11. a₁₀ + a₁₂ = 2a₁₁ dan a₁₁ = 21. Yig''indi 32.', 'medium', 'uzbmb-math-spec-2024', 'original', 1, 'published'),
  ('math-ef-02', 'math', 'math-equations-functions', 'x² − 7x + 10 = 0 tenglamaning ildizlari yig''indisini toping.', jsonb_build_array('5', '7', '10', '−7'), 1, 'Viyet teoremasiga ko''ra ildizlar yig''indisi −b/a = 7.', 'easy', 'uzbmb-math-spec-2024', 'original', 2, 'published'),
  ('math-ef-03', 'math', 'math-equations-functions', '2x² − 5x − 3 = 0 tenglamaning ildizlari x₁ va x₂ bo''lsa, 1/x₁ + 1/x₂ ni toping.', jsonb_build_array('−5/3', '−3/5', '3/5', '5/3'), 0, 'Ildizlar yig''indisi 5/2, ko''paytmasi −3/2. Ularning nisbati −5/3.', 'hard', 'uzbmb-math-spec-2024', 'original', 3, 'published'),
  ('math-ef-04', 'math', 'math-equations-functions', '9ˣ = 27 tenglamani yeching.', jsonb_build_array('1/2', '1', '3/2', '3'), 2, '9 = 3² va 27 = 3³. 2x = 3, ya''ni x = 3/2.', 'medium', 'uzbmb-math-spec-2024', 'original', 4, 'published'),
  ('math-ef-05', 'math', 'math-equations-functions', 'f(x) = x² − 1 va g(x) = 3 − 2x bo''lsa, f(g(x)) ni toping.', jsonb_build_array('4x² − 12x + 8', '4x² + 12x − 8', '2x² − 6x + 2', '8 − 2x²'), 0, 'f(g(x)) = (3 − 2x)² − 1 = 4x² − 12x + 8.', 'medium', 'uzbmb-math-spec-2024', 'original', 5, 'published'),
  ('math-ef-06', 'math', 'math-equations-functions', 'Quyidagi funksiyalardan qaysi biri toq funksiya?', jsonb_build_array('y = x³ − x', 'y = x² + 1', 'y = cos x', 'y = |x|'), 0, 'f(−x) = −f(x) bo''lgani uchun y = x³ − x toq funksiya.', 'medium', 'uzbmb-math-spec-2024', 'original', 6, 'published'),
  ('math-ge-01', 'math', 'math-geometry', 'Qo''shni ikki burchakning ayirmasi 24° ga teng. Kichik burchakni toping.', jsonb_build_array('72°', '78°', '84°', '102°'), 1, 'x + y = 180 va y − x = 24 dan x = 78°.', 'medium', 'uzbmb-math-spec-2024', 'original', 1, 'published'),
  ('math-ge-02', 'math', 'math-geometry', 'Katetlari 6 cm va 8 cm bo''lgan to''g''ri burchakli uchburchak gipotenuzasini toping.', jsonb_build_array('9 cm', '10 cm', '12 cm', '14 cm'), 1, 'Pifagor teoremasiga ko''ra c = √(6² + 8²) = 10 cm.', 'easy', 'uzbmb-math-spec-2024', 'original', 2, 'published'),
  ('math-ge-03', 'math', 'math-geometry', 'O''lchamlari 3 m × 4 m bo''lgan gilam 5 m × 6 m xonaning necha foizini egallaydi?', jsonb_build_array('35%', '40%', '45%', '50%'), 1, 'Gilam yuzi 12 m², xona yuzi 30 m². 12/30 · 100% = 40%.', 'easy', 'uzbmb-math-spec-2024', 'original', 3, 'published'),
  ('math-ge-04', 'math', 'math-geometry', 'Kvadrat diagonali 6√2 cm. Kvadrat yuzini toping.', jsonb_build_array('18 cm²', '24 cm²', '36 cm²', '72 cm²'), 2, 'd = a√2 dan a = 6 cm. Kvadrat yuzi 36 cm².', 'medium', 'uzbmb-math-spec-2024', 'original', 4, 'published'),
  ('math-ge-05', 'math', 'math-geometry', 'Koordinatalar tekisligida A(0; 0) va B(6; 8) nuqtalar orasidagi masofani toping.', jsonb_build_array('8', '10', '12', '14'), 1, 'AB = √(6² + 8²) = 10.', 'easy', 'uzbmb-math-spec-2024', 'original', 5, 'published'),
  ('math-pd-01', 'math', 'math-probability-data', 'Qutida 8 ta ko''k va 4 ta qizil shar bor. Qaytarmasdan olingan ikki sharning ikkalasi ham ko''k bo''lish ehtimolini toping.', jsonb_build_array('7/33', '14/33', '2/3', '8/11'), 1, '8/12 · 7/11 = 14/33.', 'medium', 'uzbmb-math-spec-2024', 'original', 1, 'published'),
  ('math-pd-02', 'math', 'math-probability-data', '4, 7, 9, 10 va 15 sonlarining o''rta arifmetigini toping.', jsonb_build_array('8', '9', '10', '11'), 1, 'Sonlar yig''indisi 45. 45/5 = 9.', 'easy', 'uzbmb-math-spec-2024', 'original', 2, 'published'),
  ('math-pd-03', 'math', 'math-probability-data', 'U = {−5, −4, …, 4, 5} va A = {−2, −1, 0, 1, 2, 3}. U to''plamida A ning to''ldiruvchisi nechta elementdan iborat?', jsonb_build_array('4', '5', '6', '7'), 1, 'U da 11 ta, A da 6 ta element bor. To''ldiruvchi 5 ta elementdan iborat.', 'medium', 'uzbmb-math-spec-2024', 'original', 3, 'published'),
  ('math-pd-04', 'math', 'math-probability-data', '6 nafar o''quvchidan 2 nafarini nechta usulda tanlash mumkin?', jsonb_build_array('12', '15', '20', '30'), 1, 'C(6,2) = 6 · 5 / 2 = 15.', 'medium', 'uzbmb-math-spec-2024', 'original', 4, 'published'),
  ('math-pd-05', 'math', 'math-probability-data', '3, 5, 5, 8, 11, 14 ma''lumotlar qatorining medianasini toping.', jsonb_build_array('5', '6', '6,5', '8'), 2, 'O''rtadagi 5 va 8 sonlarining o''rtachasi 6,5.', 'easy', 'uzbmb-math-spec-2024', 'original', 5, 'published')
on conflict (id) do update set
  subject_id = excluded.subject_id,
  topic_id = excluded.topic_id,
  prompt = excluded.prompt,
  options = excluded.options,
  correct_index = excluded.correct_index,
  explanation = excluded.explanation,
  difficulty = excluded.difficulty,
  source_id = excluded.source_id,
  origin = excluded.origin,
  position = excluded.position,
  status = excluded.status;

create index if not exists subjects_status_position_idx
  on public.subjects (status, position);
create index if not exists topics_status_position_idx
  on public.topics (status, position);
create index if not exists questions_status_topic_position_idx
  on public.questions (status, topic_id, position);
