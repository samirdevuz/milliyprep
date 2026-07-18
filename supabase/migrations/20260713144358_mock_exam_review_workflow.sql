-- Full Matematika mock exam and expert review workflow.
-- Official blueprint: 45 tasks, 150 minutes, 100 raw points.

alter table public.questions
  add column if not exists question_type text not null default 'single_choice'
    check (question_type in ('single_choice', 'matching', 'short_answer')),
  add column if not exists blueprint_position integer
    check (blueprint_position is null or blueprint_position between 1 and 45),
  add column if not exists points numeric(4,1) not null default 1
    check (points > 0 and points <= 100),
  add column if not exists context text,
  add column if not exists group_id text,
  add column if not exists parts jsonb,
  add column if not exists content_version text,
  add column if not exists review_note text,
  add column if not exists reviewed_by uuid references public.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz;

alter table public.practice_attempts
  add column if not exists raw_score numeric(5,1),
  add column if not exists max_score numeric(5,1);

update public.practice_attempts
set raw_score = score,
    max_score = 100
where raw_score is null or max_score is null;

alter table public.practice_attempts
  alter column raw_score set not null,
  alter column max_score set not null;

alter table public.practice_attempt_answers
  alter column selected_index drop not null,
  alter column correct_index drop not null,
  add column if not exists text_answers jsonb,
  add column if not exists earned_points numeric(4,1) not null default 0,
  add column if not exists max_points numeric(4,1) not null default 1,
  add column if not exists part_results jsonb;

alter table public.questions
  drop constraint if exists questions_correct_index_in_options;

alter table public.questions
  drop constraint if exists questions_answer_shape;

alter table public.questions
  add constraint questions_answer_shape check (
    (
      question_type = 'short_answer'
      and jsonb_array_length(options) = 0
      and jsonb_typeof(parts) = 'array'
      and jsonb_array_length(parts) = 2
    )
    or
    (
      question_type in ('single_choice', 'matching')
      and jsonb_array_length(options) >= 2
      and correct_index >= 0
      and correct_index < jsonb_array_length(options)
    )
  );

alter table public.practice_attempt_answers
  drop constraint if exists practice_answers_shape;

alter table public.practice_attempt_answers
  add constraint practice_answers_shape check (
    (
      selected_index is not null
      and text_answers is null
    )
    or
    (
      selected_index is null
      and jsonb_typeof(text_answers) = 'array'
    )
  );

alter table public.practice_attempt_answers
  drop constraint if exists practice_answers_points_valid;

alter table public.practice_attempt_answers
  add constraint practice_answers_points_valid check (
    earned_points >= 0
    and max_points > 0
    and earned_points <= max_points
  );

update public.topics set status = 'archived';

insert into public.topics (
  id, subject_id, name, description, level, estimated_minutes,
  exam_share, source_id, position, status
)
values
  ('math-numbers', 'math', 'Sonlar va amallar', 'Natural, butun, ratsional va haqiqiy sonlar hamda ular ustida amallar.', 'medium', 10, 4, 'uzbmb-math-spec-2024', 1, 'published'),
  ('math-algebra-transformations', 'math', 'Algebraik shakl almashtirishlar', 'Daraja, ildiz, trigonometriya, logarifm, progressiya va ifodalarni almashtirish.', 'medium', 31, 20, 'uzbmb-math-spec-2024', 2, 'published'),
  ('math-equations-inequalities', 'math', 'Tenglama va tengsizliklar', 'Tenglama, sistema va turli ko‘rinishdagi tengsizliklarni yechish.', 'medium', 27, 18, 'uzbmb-math-spec-2024', 3, 'published'),
  ('math-functions', 'math', 'Funksiyalar', 'Funksiya xossalari, grafiklar, kompozitsiya va ekstremumlar.', 'medium', 10, 7, 'uzbmb-math-spec-2024', 4, 'published'),
  ('math-analysis', 'math', 'Matematik analiz asoslari', 'Hosila, boshlang‘ich funksiya, integral va ularning tatbiqlari.', 'medium', 16, 11, 'uzbmb-math-spec-2024', 5, 'published'),
  ('math-geometry', 'math', 'Geometriya', 'Planimetriya, stereometriya, koordinatalar va vektorlar.', 'medium', 50, 33, 'uzbmb-math-spec-2024', 6, 'published'),
  ('math-probability-data', 'math', 'To‘plam, ma’lumotlar, ehtimollik va modellashtirish', 'To‘plam, statistika, kombinatorika, ehtimollik va modellashtirish.', 'medium', 12, 7, 'uzbmb-math-spec-2024', 7, 'published')
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

update public.questions set status = 'archived';

with seed as (
  select *
  from jsonb_to_recordset($seed$
[
  {
    "id": "math-mock-01",
    "subjectId": "math",
    "topicId": "math-numbers",
    "prompt": "84 va 126 sonlarining eng katta umumiy bo‘luvchisini toping.",
    "options": [
      "14",
      "21",
      "42",
      "63"
    ],
    "type": "single_choice",
    "position": 1,
    "points": 1.3,
    "correctIndex": 2,
    "explanation": "84 = 2²·3·7 va 126 = 2·3²·7. Umumiy ko‘paytuvchilar 2·3·7 = 42.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-02",
    "subjectId": "math",
    "topicId": "math-numbers",
    "prompt": "0,2(3) davriy o‘nli kasrni oddiy kasr ko‘rinishida yozing.",
    "options": [
      "1/5",
      "7/30",
      "7/25",
      "23/90"
    ],
    "type": "single_choice",
    "position": 2,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "0,2(3) = 0,2 + 0,0(3) = 1/5 + 1/30 = 7/30.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-03",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "Mahsulot narxi 20% oshirilib, keyin 10% kamaytirilgach 54 000 so‘m bo‘ldi. Dastlabki narxni toping.",
    "options": [
      "48 000",
      "50 000",
      "52 000",
      "55 000"
    ],
    "type": "single_choice",
    "position": 3,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "Dastlabki narx x bo‘lsa, 1,2·0,9·x = 1,08x = 54 000. Bundan x = 50 000.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-04",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "Arifmetik progressiyada a₃ = 7 va a₈ = 22. a₁₅ ni toping.",
    "options": [
      "40",
      "41",
      "42",
      "43"
    ],
    "type": "single_choice",
    "position": 4,
    "points": 2.2,
    "correctIndex": 3,
    "explanation": "5d = 22 − 7 = 15, demak d = 3. a₁ = 1 va a₁₅ = 1 + 14·3 = 43.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-05",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "√50 − √8 ifodani soddalashtiring.",
    "options": [
      "2√2",
      "3√2",
      "4√2",
      "7√2"
    ],
    "type": "single_choice",
    "position": 5,
    "points": 1.3,
    "correctIndex": 1,
    "explanation": "√50 = 5√2 va √8 = 2√2. Ayirma 3√2 ga teng.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-06",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "0,00072 sonining standart ko‘rinishini toping.",
    "options": [
      "7,2·10⁻³",
      "7,2·10⁻⁴",
      "72·10⁻⁴",
      "0,72·10⁻⁵"
    ],
    "type": "single_choice",
    "position": 6,
    "points": 1.3,
    "correctIndex": 1,
    "explanation": "Vergul to‘rt xona o‘ngga ko‘chirilsa 7,2 hosil bo‘ladi, shuning uchun 7,2·10⁻⁴.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-07",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "x ≠ 2 va x ≠ −1 bo‘lsa, (x² − 4)/(x² − x − 2) ifodani soddalashtiring.",
    "options": [
      "(x − 2)/(x + 1)",
      "(x + 2)/(x + 1)",
      "(x + 2)/(x − 1)",
      "x + 2"
    ],
    "type": "single_choice",
    "position": 7,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "Surat (x−2)(x+2), maxraj (x−2)(x+1). Umumiy ko‘paytuvchi qisqargach (x+2)/(x+1) qoladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-08",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "α o‘tkir burchak va tg α = 3/4 bo‘lsa, sin α ni toping.",
    "options": [
      "3/5",
      "4/5",
      "3/4",
      "5/4"
    ],
    "type": "single_choice",
    "position": 8,
    "points": 2.2,
    "correctIndex": 0,
    "explanation": "Katetlar 3 va 4 nisbatda bo‘lsa, gipotenuza 5. Shuning uchun sin α = 3/5.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-09",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "log₂(x − 1) = 3 tenglamani yeching.",
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "type": "single_choice",
    "position": 9,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "x − 1 = 2³ = 8, demak x = 9.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-10",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "x + y = 8 va xy = 12 bo‘lsa, x² + y² ni toping.",
    "options": [
      "32",
      "36",
      "40",
      "52"
    ],
    "type": "single_choice",
    "position": 10,
    "points": 1.3,
    "correctIndex": 2,
    "explanation": "x²+y² = (x+y)² − 2xy = 64 − 24 = 40.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-11",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "Geometrik progressiyada b₁ = 3 va q = 2. Dastlabki 5 ta had yig‘indisini toping.",
    "options": [
      "63",
      "75",
      "93",
      "96"
    ],
    "type": "single_choice",
    "position": 11,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "S₅ = 3(2⁵−1)/(2−1) = 3·31 = 93.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-12",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "cos²15° + sin²15° ifodaning qiymatini toping.",
    "options": [
      "0",
      "1/2",
      "1",
      "2"
    ],
    "type": "single_choice",
    "position": 12,
    "points": 1.3,
    "correctIndex": 2,
    "explanation": "Asosiy trigonometrik ayniyatga ko‘ra sin²α + cos²α = 1.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-13",
    "subjectId": "math",
    "topicId": "math-algebra-transformations",
    "prompt": "Ikki sonning nisbati 3:5, yig‘indisi 64. Kichik sonni toping.",
    "options": [
      "18",
      "21",
      "24",
      "40"
    ],
    "type": "single_choice",
    "position": 13,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "Jami 8 ulush 64 ga teng, bir ulush 8. Kichik son 3·8 = 24.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-14",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "x² − 9x + 20 = 0 tenglamaning katta ildizini toping.",
    "options": [
      "4",
      "5",
      "9",
      "20"
    ],
    "type": "single_choice",
    "position": 14,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "Tenglama (x−4)(x−5)=0 ko‘rinishga keladi. Katta ildiz 5.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-15",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "|2x − 5| = 7 tenglama ildizlari yig‘indisini toping.",
    "options": [
      "−1",
      "5",
      "6",
      "7"
    ],
    "type": "single_choice",
    "position": 15,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "2x−5=7 dan x=6; 2x−5=−7 dan x=−1. Yig‘indi 5.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-16",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "3x² − 8x − 3 = 0 tenglama ildizlari x₁ va x₂ bo‘lsa, 1/x₁ + 1/x₂ ni toping.",
    "options": [
      "−8/3",
      "−3/8",
      "3/8",
      "8/3"
    ],
    "type": "single_choice",
    "position": 16,
    "points": 1.3,
    "correctIndex": 0,
    "explanation": "(x₁+x₂)/(x₁x₂) = (8/3)/(−1) = −8/3.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-17",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "x + y = 7 va x² + y² = 29 bo‘lsa, xy ni toping.",
    "options": [
      "8",
      "10",
      "12",
      "20"
    ],
    "type": "single_choice",
    "position": 17,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "49 = (x+y)² = x²+y²+2xy = 29+2xy. Demak xy=10.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-18",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "√(x + 4) < 3 tengsizlikning yechimini toping.",
    "options": [
      "(−∞; 5)",
      "[−4; 5)",
      "(−4; 5]",
      "[−4; 9)"
    ],
    "type": "single_choice",
    "position": 18,
    "points": 1.3,
    "correctIndex": 1,
    "explanation": "Aniqlanish sohasi x≥−4. Kvadratga oshirishdan x+4<9, ya’ni x<5. Kesishma [−4;5).",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-19",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "(x − 2)/(x + 1) ≥ 0 tengsizlikning yechimini toping.",
    "options": [
      "(−1; 2)",
      "(−∞; −1) ∪ [2; +∞)",
      "(−∞; −1] ∪ (2; +∞)",
      "[−1; 2]"
    ],
    "type": "single_choice",
    "position": 19,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "Kritik nuqtalar −1 va 2. Ishora tahlili natijasi (−∞;−1)∪[2;+∞); x=−1 kirmaydi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-20",
    "subjectId": "math",
    "topicId": "math-functions",
    "prompt": "Quyidagi funksiyalardan qaysi biri toq funksiya?",
    "options": [
      "f(x)=x³+2x",
      "f(x)=x²+2",
      "f(x)=|x|",
      "f(x)=cos x"
    ],
    "type": "single_choice",
    "position": 20,
    "points": 1.3,
    "correctIndex": 0,
    "explanation": "f(−x)=−x³−2x=−f(x), shuning uchun x³+2x toq funksiya.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-21",
    "subjectId": "math",
    "topicId": "math-functions",
    "prompt": "f(x)=2x−1 va g(x)=x²+3 bo‘lsa, g(f(2)) ni toping.",
    "options": [
      "9",
      "10",
      "12",
      "15"
    ],
    "type": "single_choice",
    "position": 21,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "f(2)=3. Shuning uchun g(f(2))=g(3)=9+3=12.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-22",
    "subjectId": "math",
    "topicId": "math-analysis",
    "prompt": "f(x)=x³−3x bo‘lsa, f′(2) ni toping.",
    "options": [
      "3",
      "6",
      "9",
      "12"
    ],
    "type": "single_choice",
    "position": 22,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "f′(x)=3x²−3. f′(2)=12−3=9.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-23",
    "subjectId": "math",
    "topicId": "math-analysis",
    "prompt": "2x + 1 funksiyaning boshlang‘ich funksiyasini toping.",
    "options": [
      "x²+x+C",
      "2x²+x+C",
      "x²+1+C",
      "2+C"
    ],
    "type": "single_choice",
    "position": 23,
    "points": 2.2,
    "correctIndex": 0,
    "explanation": "∫(2x+1)dx = x²+x+C.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-24",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Uchburchakning ikki burchagi 48° va 67°. Uchinchi burchakni toping.",
    "options": [
      "55°",
      "65°",
      "75°",
      "85°"
    ],
    "type": "single_choice",
    "position": 24,
    "points": 1.3,
    "correctIndex": 1,
    "explanation": "Uchburchak burchaklari yig‘indisi 180°. 180−48−67=65°.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-25",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Katetlari 5 cm va 12 cm bo‘lgan to‘g‘ri burchakli uchburchak gipotenuzasini toping.",
    "options": [
      "11 cm",
      "13 cm",
      "15 cm",
      "17 cm"
    ],
    "type": "single_choice",
    "position": 25,
    "points": 1.3,
    "correctIndex": 1,
    "explanation": "c=√(5²+12²)=√169=13 cm.",
    "difficulty": "easy",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-26",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Radiusi 5 cm bo‘lgan doiraning yuzini toping.",
    "options": [
      "10π cm²",
      "20π cm²",
      "25π cm²",
      "50π cm²"
    ],
    "type": "single_choice",
    "position": 26,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "S=πr²=π·25=25π cm².",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-27",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "O‘xshash ikki uchburchakning mos tomonlari nisbati 2:3. Ularning yuzlari nisbatini toping.",
    "options": [
      "2:3",
      "4:9",
      "6:9",
      "8:27"
    ],
    "type": "single_choice",
    "position": 27,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "O‘xshash shakllar yuzlari chiziqli nisbat kvadratiga teng: 2²:3²=4:9.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-28",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "a=(3;4) vektorning uzunligini toping.",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "type": "single_choice",
    "position": 28,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "|a|=√(3²+4²)=5.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-29",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Radiusi 3 cm, balandligi 5 cm bo‘lgan silindr hajmini toping.",
    "options": [
      "15π cm³",
      "30π cm³",
      "45π cm³",
      "90π cm³"
    ],
    "type": "single_choice",
    "position": 29,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "V=πr²h=π·9·5=45π cm³.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-30",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "A(−2;4) va B(6;−2) nuqtalarni tutashtirgan kesmaning o‘rta nuqtasini toping.",
    "options": [
      "(2;1)",
      "(4;2)",
      "(2;−1)",
      "(−4;6)"
    ],
    "type": "single_choice",
    "position": 30,
    "points": 2.2,
    "correctIndex": 0,
    "explanation": "O‘rta nuqta ((−2+6)/2;(4−2)/2)=(2;1).",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-31",
    "subjectId": "math",
    "topicId": "math-probability-data",
    "prompt": "2, 5, 7, 7, 9 sonlar qatorining medianasini toping.",
    "options": [
      "5",
      "6",
      "7",
      "9"
    ],
    "type": "single_choice",
    "position": 31,
    "points": 2.2,
    "correctIndex": 2,
    "explanation": "Tartiblangan 5 ta sonning o‘rtasidagi qiymat 7.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-32",
    "subjectId": "math",
    "topicId": "math-probability-data",
    "prompt": "Qutida 5 ta oq va 3 ta qora shar bor. Tasodifiy olingan bitta sharning qora bo‘lish ehtimolini toping.",
    "options": [
      "3/5",
      "3/8",
      "5/8",
      "1/3"
    ],
    "type": "single_choice",
    "position": 32,
    "points": 2.2,
    "correctIndex": 1,
    "explanation": "Jami 8 ta shar, shundan 3 tasi qora. Ehtimollik 3/8.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-33",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Parallelepipedning hajmini toping.",
    "options": [
      "60",
      "74",
      "94",
      "√41",
      "5√2",
      "120"
    ],
    "type": "matching",
    "position": 33,
    "points": 2.2,
    "context": "O‘lchamlari 3 cm, 4 cm va 5 cm bo‘lgan to‘g‘ri burchakli parallelepiped berilgan. 33–35-topshiriqlarni A–F javoblar bilan moslashtiring.",
    "groupId": "math-matching-box",
    "correctIndex": 0,
    "explanation": "V=3·4·5=60 cm³.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "published",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-34",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Parallelepipedning to‘la sirt yuzini toping.",
    "options": [
      "60",
      "74",
      "94",
      "√41",
      "5√2",
      "120"
    ],
    "type": "matching",
    "position": 34,
    "points": 2.2,
    "context": "O‘lchamlari 3 cm, 4 cm va 5 cm bo‘lgan to‘g‘ri burchakli parallelepiped berilgan. 33–35-topshiriqlarni A–F javoblar bilan moslashtiring.",
    "groupId": "math-matching-box",
    "correctIndex": 2,
    "explanation": "S=2(3·4+3·5+4·5)=2(12+15+20)=94 cm².",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-35",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Parallelepipedning fazoviy diagonalini toping.",
    "options": [
      "60",
      "74",
      "94",
      "√41",
      "5√2",
      "120"
    ],
    "type": "matching",
    "position": 35,
    "points": 2.2,
    "context": "O‘lchamlari 3 cm, 4 cm va 5 cm bo‘lgan to‘g‘ri burchakli parallelepiped berilgan. 33–35-topshiriqlarni A–F javoblar bilan moslashtiring.",
    "groupId": "math-matching-box",
    "correctIndex": 4,
    "explanation": "d=√(3²+4²+5²)=√50=5√2 cm.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2"
  },
  {
    "id": "math-mock-36",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "(x − 2)² = 9 tenglamani yeching.",
    "options": [],
    "type": "short_answer",
    "position": 36,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Tenglama nechta haqiqiy ildizga ega?",
        "points": 1.5,
        "correctAnswer": "2",
        "acceptedAnswers": [
          "2",
          "2 ta"
        ],
        "explanation": "x−2=±3 bo‘lgani uchun ikki ildiz bor."
      },
      {
        "id": "b",
        "prompt": "Ildizlar ko‘paytmasini toping.",
        "points": 1.7,
        "correctAnswer": "−5",
        "acceptedAnswers": [
          "-5",
          "−5"
        ],
        "explanation": "Ildizlar 5 va −1; ko‘paytma −5."
      }
    ]
  },
  {
    "id": "math-mock-37",
    "subjectId": "math",
    "topicId": "math-equations-inequalities",
    "prompt": "sin x = 1/2 tenglamani x ∈ [0; 2π] kesmada qarang.",
    "options": [],
    "type": "short_answer",
    "position": 37,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Eng kichik musbat ildizni toping.",
        "points": 1.5,
        "correctAnswer": "π/6",
        "acceptedAnswers": [
          "π/6",
          "pi/6"
        ],
        "explanation": "Birinchi chorakdagi yechim x=π/6."
      },
      {
        "id": "b",
        "prompt": "Kesmadagi ildizlar sonini toping.",
        "points": 1.7,
        "correctAnswer": "2",
        "acceptedAnswers": [
          "2",
          "2 ta"
        ],
        "explanation": "Yechimlar π/6 va 5π/6, jami 2 ta."
      }
    ]
  },
  {
    "id": "math-mock-38",
    "subjectId": "math",
    "topicId": "math-functions",
    "prompt": "f(x)=x²−4x+3 kvadrat funksiya berilgan.",
    "options": [],
    "type": "short_answer",
    "position": 38,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Parabola uchining abssissasini toping.",
        "points": 1.5,
        "correctAnswer": "2",
        "acceptedAnswers": [
          "2"
        ],
        "explanation": "x₀=−b/(2a)=4/2=2."
      },
      {
        "id": "b",
        "prompt": "Funksiyaning eng kichik qiymatini toping.",
        "points": 1.7,
        "correctAnswer": "−1",
        "acceptedAnswers": [
          "-1",
          "−1"
        ],
        "explanation": "f(2)=4−8+3=−1."
      }
    ]
  },
  {
    "id": "math-mock-39",
    "subjectId": "math",
    "topicId": "math-analysis",
    "prompt": "f(x)=x³−6x²+9x funksiya berilgan.",
    "options": [],
    "type": "short_answer",
    "position": 39,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "f′(1) ni toping.",
        "points": 1.5,
        "correctAnswer": "0",
        "acceptedAnswers": [
          "0"
        ],
        "explanation": "f′(x)=3x²−12x+9; f′(1)=0."
      },
      {
        "id": "b",
        "prompt": "Funksiyaning kritik nuqtalari sonini toping.",
        "points": 1.7,
        "correctAnswer": "2",
        "acceptedAnswers": [
          "2",
          "2 ta"
        ],
        "explanation": "f′(x)=3(x−1)(x−3), shuning uchun x=1 va x=3 — ikki kritik nuqta."
      }
    ]
  },
  {
    "id": "math-mock-40",
    "subjectId": "math",
    "topicId": "math-analysis",
    "prompt": "f(x)=2x funksiya va [0;3] kesma berilgan.",
    "options": [],
    "type": "short_answer",
    "position": 40,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "f(3) ni toping.",
        "points": 1.5,
        "correctAnswer": "6",
        "acceptedAnswers": [
          "6"
        ],
        "explanation": "f(3)=2·3=6."
      },
      {
        "id": "b",
        "prompt": "Funksiya grafigi, Ox o‘qi va x=3 chiziq orasidagi yuzni toping.",
        "points": 1.7,
        "correctAnswer": "9",
        "acceptedAnswers": [
          "9",
          "9 birlik",
          "9 birlik²"
        ],
        "explanation": "S=∫₀³2x dx=x²|₀³=9."
      }
    ]
  },
  {
    "id": "math-mock-41",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Katetlari 9 cm va 12 cm bo‘lgan to‘g‘ri burchakli uchburchak berilgan.",
    "options": [],
    "type": "short_answer",
    "position": 41,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Gipotenuza uzunligini toping.",
        "points": 1.5,
        "correctAnswer": "15",
        "acceptedAnswers": [
          "15",
          "15 cm"
        ],
        "explanation": "√(9²+12²)=√225=15."
      },
      {
        "id": "b",
        "prompt": "Uchburchak yuzini toping.",
        "points": 1.7,
        "correctAnswer": "54",
        "acceptedAnswers": [
          "54",
          "54 cm2",
          "54 cm²"
        ],
        "explanation": "S=9·12/2=54 cm²."
      }
    ]
  },
  {
    "id": "math-mock-42",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Kvadrat diagonali 10√2 cm ga teng.",
    "options": [],
    "type": "short_answer",
    "position": 42,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "medium",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Kvadrat tomonini toping.",
        "points": 1.5,
        "correctAnswer": "10",
        "acceptedAnswers": [
          "10",
          "10 cm"
        ],
        "explanation": "d=a√2 dan a=10 cm."
      },
      {
        "id": "b",
        "prompt": "Kvadrat yuzini toping.",
        "points": 1.7,
        "correctAnswer": "100",
        "acceptedAnswers": [
          "100",
          "100 cm2",
          "100 cm²"
        ],
        "explanation": "S=a²=100 cm²."
      }
    ]
  },
  {
    "id": "math-mock-43",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Markazi M(4;4) nuqtada bo‘lgan aylana Ox va Oy o‘qlariga urinadi.",
    "options": [],
    "type": "short_answer",
    "position": 43,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Aylana radiusini toping.",
        "points": 1.5,
        "correctAnswer": "4",
        "acceptedAnswers": [
          "4",
          "4 birlik"
        ],
        "explanation": "Markazdan har bir koordinata o‘qigacha masofa 4."
      },
      {
        "id": "b",
        "prompt": "OM masofani toping.",
        "points": 1.7,
        "correctAnswer": "4√2",
        "acceptedAnswers": [
          "4√2",
          "4sqrt2",
          "4*sqrt2"
        ],
        "explanation": "OM=√(4²+4²)=√32=4√2."
      }
    ]
  },
  {
    "id": "math-mock-44",
    "subjectId": "math",
    "topicId": "math-geometry",
    "prompt": "Qirrasi 6 cm bo‘lgan kub berilgan.",
    "options": [],
    "type": "short_answer",
    "position": 44,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "Kub bir yog‘ining diagonalini toping.",
        "points": 1.5,
        "correctAnswer": "6√2",
        "acceptedAnswers": [
          "6√2",
          "6sqrt2",
          "6*sqrt2"
        ],
        "explanation": "Kvadrat yuzi diagonali a√2=6√2."
      },
      {
        "id": "b",
        "prompt": "Kub hajmini toping.",
        "points": 1.7,
        "correctAnswer": "216",
        "acceptedAnswers": [
          "216",
          "216 cm3",
          "216 cm³"
        ],
        "explanation": "V=a³=6³=216 cm³."
      }
    ]
  },
  {
    "id": "math-mock-45",
    "subjectId": "math",
    "topicId": "math-probability-data",
    "prompt": "Taksi safarining narxi y=4000+2500x formula bilan hisoblanadi; x — bosib o‘tilgan kilometr.",
    "options": [],
    "type": "short_answer",
    "position": 45,
    "points": 3.2,
    "correctIndex": 0,
    "explanation": "Har bir band alohida tekshiriladi.",
    "difficulty": "hard",
    "sourceId": "uzbmb-math-spec-2024",
    "origin": "original",
    "reviewStatus": "review",
    "contentVersion": "2026.07.2",
    "parts": [
      {
        "id": "a",
        "prompt": "6 km safar narxini toping.",
        "points": 1.5,
        "correctAnswer": "19000",
        "acceptedAnswers": [
          "19000",
          "19 000",
          "19000 so‘m",
          "19 000 so‘m"
        ],
        "explanation": "y=4000+2500·6=19 000 so‘m."
      },
      {
        "id": "b",
        "prompt": "Safar narxi 29 000 so‘m bo‘lsa, masofani toping.",
        "points": 1.7,
        "correctAnswer": "10",
        "acceptedAnswers": [
          "10",
          "10 km"
        ],
        "explanation": "29 000=4000+2500x dan x=10 km."
      }
    ]
  }
]
$seed$::jsonb) as item(
    id text,
    "subjectId" text,
    "topicId" text,
    prompt text,
    options jsonb,
    type text,
    position integer,
    points numeric,
    context text,
    "groupId" text,
    "correctIndex" integer,
    explanation text,
    difficulty text,
    "sourceId" text,
    origin text,
    "reviewStatus" text,
    "reviewNote" text,
    "contentVersion" text,
    parts jsonb
  )
)
insert into public.questions (
  id, subject_id, topic_id, prompt, options, correct_index, explanation,
  difficulty, source_id, origin, position, status, question_type,
  blueprint_position, points, context, group_id, parts, review_note,
  content_version
)
select
  id,
  "subjectId",
  "topicId",
  prompt,
  options,
  "correctIndex",
  explanation,
  difficulty,
  "sourceId",
  origin,
  position,
  "reviewStatus",
  type,
  position,
  points,
  context,
  "groupId",
  parts,
  "reviewNote",
  "contentVersion"
from seed
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
  status = excluded.status,
  question_type = excluded.question_type,
  blueprint_position = excluded.blueprint_position,
  points = excluded.points,
  context = excluded.context,
  group_id = excluded.group_id,
  parts = excluded.parts,
  review_note = excluded.review_note,
  content_version = excluded.content_version;

create unique index if not exists questions_blueprint_position_live_unique
  on public.questions (blueprint_position)
  where status in ('review', 'published');

create index if not exists questions_review_queue_idx
  on public.questions (status, blueprint_position)
  where status in ('draft', 'review');

create index if not exists practice_attempts_user_raw_score_idx
  on public.practice_attempts (user_id, raw_score desc, completed_at desc);

alter table public.questions enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.practice_attempt_answers enable row level security;

revoke all on table public.questions from anon, authenticated;
revoke all on table public.practice_attempts from anon, authenticated;
revoke all on table public.practice_attempt_answers from anon, authenticated;

