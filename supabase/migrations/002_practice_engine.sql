-- MilliyPrep practice/test engine schema.
-- Run after 001_initial_auth.sql.

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  description text not null default '',
  color text not null default 'brand',
  exam_weight integer not null default 0 check (exam_weight >= 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topics (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  name text not null,
  description text not null default '',
  level text not null default 'easy' check (level in ('easy', 'medium', 'hard')),
  estimated_minutes integer not null default 15 check (estimated_minutes > 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_index integer not null check (correct_index >= 0),
  explanation text not null default '',
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_options_array check (jsonb_typeof(options) = 'array')
);

create table if not exists public.practice_attempts (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  mode text not null check (mode in ('practice', 'mock_test')),
  subject_id text references public.subjects(id) on delete set null,
  topic_id text references public.topics(id) on delete set null,
  score integer not null check (score >= 0 and score <= 100),
  total integer not null check (total > 0),
  correct_count integer not null check (correct_count >= 0),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.practice_attempt_answers (
  id uuid primary key,
  attempt_id uuid not null references public.practice_attempts(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  selected_index integer not null,
  correct_index integer not null,
  is_correct boolean not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists topics_subject_id_idx
  on public.topics (subject_id);

create index if not exists questions_topic_id_idx
  on public.questions (topic_id);

create index if not exists practice_attempts_user_completed_idx
  on public.practice_attempts (user_id, completed_at desc);

create index if not exists practice_attempt_answers_attempt_idx
  on public.practice_attempt_answers (attempt_id);

drop trigger if exists subjects_set_updated_at on public.subjects;
create trigger subjects_set_updated_at
before update on public.subjects
for each row
execute function public.set_updated_at();

drop trigger if exists topics_set_updated_at on public.topics;
create trigger topics_set_updated_at
before update on public.topics
for each row
execute function public.set_updated_at();

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
before update on public.questions
for each row
execute function public.set_updated_at();

alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.practice_attempt_answers enable row level security;

revoke all on table public.subjects from anon, authenticated;
revoke all on table public.topics from anon, authenticated;
revoke all on table public.questions from anon, authenticated;
revoke all on table public.practice_attempts from anon, authenticated;
revoke all on table public.practice_attempt_answers from anon, authenticated;

insert into public.subjects (id, name, description, color, exam_weight, position)
values
  ('mathematics', 'Matematika', 'Algebra, geometriya va mantiqiy masalalar.', 'brand', 40, 1),
  ('uzbek', 'Ona tili', 'Imlo, uslubiyat va matn bilan ishlash.', 'accent', 25, 2),
  ('english', 'Ingliz tili', 'Grammar, vocabulary va reading comprehension.', 'violet', 20, 3)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  exam_weight = excluded.exam_weight,
  position = excluded.position;

insert into public.topics (id, subject_id, name, description, level, estimated_minutes, position)
values
  ('linear-equations', 'mathematics', 'Chiziqli tenglamalar', 'Bir noma''lumli tenglamalar va matnli masalalar.', 'easy', 15, 1),
  ('quadratic-basics', 'mathematics', 'Kvadrat tenglama', 'Diskriminant, ildizlar va koeffitsiyentlar.', 'medium', 20, 2),
  ('triangles', 'mathematics', 'Uchburchaklar', 'Burchaklar, perimetr va yuzaga oid savollar.', 'medium', 18, 3),
  ('spelling', 'uzbek', 'Imlo qoidalari', 'Qo''shma va ajratib yoziladigan so''zlar.', 'easy', 12, 1),
  ('text-analysis', 'uzbek', 'Matn tahlili', 'Asosiy fikr, dalil va xulosa bilan ishlash.', 'medium', 16, 2),
  ('english-tenses', 'english', 'English tenses', 'Present, past va future zamonlar.', 'easy', 14, 1),
  ('reading-main-idea', 'english', 'Reading: main idea', 'Matndagi asosiy fikr va kontekstni topish.', 'medium', 18, 2)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  name = excluded.name,
  description = excluded.description,
  level = excluded.level,
  estimated_minutes = excluded.estimated_minutes,
  position = excluded.position;

insert into public.questions (
  id,
  subject_id,
  topic_id,
  prompt,
  options,
  correct_index,
  explanation,
  difficulty,
  position
)
values
  ('q-linear-1', 'mathematics', 'linear-equations', '3x + 7 = 22 tenglamani yeching.', '["x = 3", "x = 5", "x = 7", "x = 9"]', 1, '3x = 22 - 7 = 15, demak x = 5.', 'easy', 1),
  ('q-linear-2', 'mathematics', 'linear-equations', '2(x - 4) = 18 bo''lsa, x nechaga teng?', '["9", "11", "13", "15"]', 2, '2x - 8 = 18, 2x = 26, x = 13.', 'easy', 2),
  ('q-linear-3', 'mathematics', 'linear-equations', 'Ali bir son o''yladi. Sonning 4 baravaridan 6 ayirilsa 30 chiqadi. Sonni toping.', '["6", "8", "9", "12"]', 2, '4x - 6 = 30, 4x = 36, x = 9.', 'medium', 3),
  ('q-quad-1', 'mathematics', 'quadratic-basics', 'x^2 - 5x + 6 = 0 tenglamaning ildizlari qaysi?', '["1 va 6", "2 va 3", "-2 va -3", "0 va 5"]', 1, '2 va 3 sonlarining yig''indisi 5, ko''paytmasi 6.', 'medium', 1),
  ('q-quad-2', 'mathematics', 'quadratic-basics', 'x^2 - 9 = 0 tenglama uchun x qiymatlari qaysi?', '["0 va 9", "-9 va 9", "-3 va 3", "3 va 9"]', 2, 'x^2 = 9, shuning uchun x = -3 yoki x = 3.', 'easy', 2),
  ('q-triangle-1', 'mathematics', 'triangles', 'Uchburchak burchaklari yig''indisi nechaga teng?', '["90°", "120°", "180°", "360°"]', 2, 'Har qanday uchburchak ichki burchaklari yig''indisi 180°.', 'easy', 1),
  ('q-triangle-2', 'mathematics', 'triangles', 'Tomonlari 5, 5 va 6 bo''lgan uchburchak qanday turga kiradi?', '["Teng tomonli", "Teng yonli", "To''g''ri burchakli", "Mavjud emas"]', 1, 'Ikki tomoni teng bo''lgani uchun bu teng yonli uchburchak.', 'easy', 2),
  ('q-spelling-1', 'uzbek', 'spelling', 'Qaysi so''z to''g''ri yozilgan?', '["xohlagan", "hohlagan", "xoxlagan", "hoh-lagan"]', 0, 'Adabiy imlo bo''yicha to''g''ri shakl: xohlagan.', 'easy', 1),
  ('q-spelling-2', 'uzbek', 'spelling', 'Qaysi birikma qo''shib yoziladi?', '["har doim", "bir oz", "allaqachon", "shu bilan"]', 2, '''Allaqachon'' ravishi qo''shib yoziladi.', 'medium', 2),
  ('q-text-1', 'uzbek', 'text-analysis', 'Matnning asosiy fikri deganda nima tushuniladi?', '["Eng uzun gap", "Muallif yetkazmoqchi bo''lgan bosh mazmun", "Birinchi jumla", "Notanish so''zlar ro''yxati"]', 1, 'Asosiy fikr matnning bosh mazmunini ifodalaydi.', 'easy', 1),
  ('q-text-2', 'uzbek', 'text-analysis', 'Dalilning vazifasi qaysi?', '["Fikrni bezash", "Xulosani yashirish", "Fikrni asoslash", "Matnni qisqartirish"]', 2, 'Dalil keltirilgan fikrni isbotlash yoki asoslash uchun ishlatiladi.', 'medium', 2),
  ('q-tense-1', 'english', 'english-tenses', 'Choose the correct sentence.', '["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."]', 1, 'With he/she/it in Present Simple, the verb takes -s: goes.', 'easy', 1),
  ('q-tense-2', 'english', 'english-tenses', 'I ____ my homework yesterday.', '["do", "does", "did", "doing"]', 2, 'Yesterday signals Past Simple, so the correct verb is did.', 'easy', 2),
  ('q-reading-1', 'english', 'reading-main-idea', 'In reading tasks, ''main idea'' usually means:', '["The longest word in the text", "The writer''s central message", "The final punctuation mark", "A random example"]', 1, 'The main idea is the central message or point of the text.', 'easy', 1),
  ('q-reading-2', 'english', 'reading-main-idea', 'Which question helps find the main idea?', '["What is this text mostly about?", "How many commas are there?", "Which word is shortest?", "Who printed the page?"]', 0, 'Asking what the text is mostly about points to the main idea.', 'medium', 2)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  topic_id = excluded.topic_id,
  prompt = excluded.prompt,
  options = excluded.options,
  correct_index = excluded.correct_index,
  explanation = excluded.explanation,
  difficulty = excluded.difficulty,
  position = excluded.position;
