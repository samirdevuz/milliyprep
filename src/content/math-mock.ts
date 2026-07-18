import type {
  Question,
  QuestionPart,
  QuestionType,
  ReviewStatus,
} from "@/lib/practice/types";

export const MATH_MOCK_DURATION_MINUTES = 150;
export const MATH_MOCK_QUESTION_COUNT = 45;
export const MATH_MOCK_MAX_POINTS = 100;
export const MATH_MOCK_CONTENT_VERSION = "2026.07.2";

export interface MathMockBlueprintSection {
  topicId: string;
  name: string;
  positions: readonly number[];
  questionTypes: readonly QuestionType[];
  rawPoints: number;
}

export const MATH_MOCK_BLUEPRINT: MathMockBlueprintSection[] = [
  {
    topicId: "math-numbers",
    name: "Sonlar va amallar",
    positions: [1, 2],
    questionTypes: ["single_choice"],
    rawPoints: 3.5,
  },
  {
    topicId: "math-algebra-transformations",
    name: "Algebraik shakl almashtirishlar",
    positions: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    questionTypes: ["single_choice"],
    rawPoints: 20.6,
  },
  {
    topicId: "math-equations-inequalities",
    name: "Tenglama va tengsizliklar",
    positions: [14, 15, 16, 17, 18, 19, 36, 37],
    questionTypes: ["single_choice", "short_answer"],
    rawPoints: 17.8,
  },
  {
    topicId: "math-functions",
    name: "Funksiyalar",
    positions: [20, 21, 38],
    questionTypes: ["single_choice", "short_answer"],
    rawPoints: 6.7,
  },
  {
    topicId: "math-analysis",
    name: "Matematik analiz asoslari",
    positions: [22, 23, 39, 40],
    questionTypes: ["single_choice", "short_answer"],
    rawPoints: 10.8,
  },
  {
    topicId: "math-geometry",
    name: "Geometriya",
    positions: [24, 25, 26, 27, 28, 29, 30, 33, 34, 35, 41, 42, 43, 44],
    questionTypes: ["single_choice", "matching", "short_answer"],
    rawPoints: 33,
  },
  {
    topicId: "math-probability-data",
    name: "To‘plam, ma’lumotlar, ehtimollik va modellashtirish",
    positions: [31, 32, 45],
    questionTypes: ["single_choice", "short_answer"],
    rawPoints: 7.6,
  },
];

const publishedPositions = new Set([
  1, 2, 3, 4, 5, 6, 14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33,
]);

function statusFor(position: number): ReviewStatus {
  return publishedPositions.has(position) ? "published" : "review";
}

interface ClosedQuestionInput {
  position: number;
  topicId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Question["difficulty"];
  points: number;
  type?: Extract<QuestionType, "single_choice" | "matching">;
  context?: string;
  groupId?: string;
}

function closedQuestion(input: ClosedQuestionInput): Question {
  return {
    id: `math-mock-${String(input.position).padStart(2, "0")}`,
    subjectId: "math",
    topicId: input.topicId,
    prompt: input.prompt,
    options: input.options,
    type: input.type ?? "single_choice",
    position: input.position,
    points: input.points,
    context: input.context,
    groupId: input.groupId,
    correctIndex: input.correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    sourceId: "uzbmb-math-spec-2024",
    origin: "original",
    reviewStatus: statusFor(input.position),
    contentVersion: MATH_MOCK_CONTENT_VERSION,
  };
}

interface OpenQuestionInput {
  position: number;
  topicId: string;
  prompt: string;
  difficulty: Question["difficulty"];
  parts: [QuestionPart, QuestionPart];
}

function openQuestion(input: OpenQuestionInput): Question {
  return {
    id: `math-mock-${String(input.position).padStart(2, "0")}`,
    subjectId: "math",
    topicId: input.topicId,
    prompt: input.prompt,
    options: [],
    type: "short_answer",
    position: input.position,
    points: 3.2,
    correctIndex: 0,
    explanation: "Har bir band alohida tekshiriladi.",
    difficulty: input.difficulty,
    sourceId: "uzbmb-math-spec-2024",
    origin: "original",
    reviewStatus: statusFor(input.position),
    contentVersion: MATH_MOCK_CONTENT_VERSION,
    parts: input.parts,
  };
}

const matchingContext =
  "O‘lchamlari 3 cm, 4 cm va 5 cm bo‘lgan to‘g‘ri burchakli parallelepiped berilgan. 33–35-topshiriqlarni A–F javoblar bilan moslashtiring.";
const matchingOptions = ["60", "74", "94", "√41", "5√2", "120"];

export const MATH_MOCK_QUESTIONS: Question[] = [
  closedQuestion({
    position: 1,
    topicId: "math-numbers",
    prompt: "84 va 126 sonlarining eng katta umumiy bo‘luvchisini toping.",
    options: ["14", "21", "42", "63"],
    correctIndex: 2,
    explanation: "84 = 2²·3·7 va 126 = 2·3²·7. Umumiy ko‘paytuvchilar 2·3·7 = 42.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 2,
    topicId: "math-numbers",
    prompt: "0,2(3) davriy o‘nli kasrni oddiy kasr ko‘rinishida yozing.",
    options: ["1/5", "7/30", "7/25", "23/90"],
    correctIndex: 1,
    explanation: "0,2(3) = 0,2 + 0,0(3) = 1/5 + 1/30 = 7/30.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 3,
    topicId: "math-algebra-transformations",
    prompt: "Mahsulot narxi 20% oshirilib, keyin 10% kamaytirilgach 54 000 so‘m bo‘ldi. Dastlabki narxni toping.",
    options: ["48 000", "50 000", "52 000", "55 000"],
    correctIndex: 1,
    explanation: "Dastlabki narx x bo‘lsa, 1,2·0,9·x = 1,08x = 54 000. Bundan x = 50 000.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 4,
    topicId: "math-algebra-transformations",
    prompt: "Arifmetik progressiyada a₃ = 7 va a₈ = 22. a₁₅ ni toping.",
    options: ["40", "41", "42", "43"],
    correctIndex: 3,
    explanation: "5d = 22 − 7 = 15, demak d = 3. a₁ = 1 va a₁₅ = 1 + 14·3 = 43.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 5,
    topicId: "math-algebra-transformations",
    prompt: "√50 − √8 ifodani soddalashtiring.",
    options: ["2√2", "3√2", "4√2", "7√2"],
    correctIndex: 1,
    explanation: "√50 = 5√2 va √8 = 2√2. Ayirma 3√2 ga teng.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 6,
    topicId: "math-algebra-transformations",
    prompt: "0,00072 sonining standart ko‘rinishini toping.",
    options: ["7,2·10⁻³", "7,2·10⁻⁴", "72·10⁻⁴", "0,72·10⁻⁵"],
    correctIndex: 1,
    explanation: "Vergul to‘rt xona o‘ngga ko‘chirilsa 7,2 hosil bo‘ladi, shuning uchun 7,2·10⁻⁴.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 7,
    topicId: "math-algebra-transformations",
    prompt: "x ≠ 2 va x ≠ −1 bo‘lsa, (x² − 4)/(x² − x − 2) ifodani soddalashtiring.",
    options: ["(x − 2)/(x + 1)", "(x + 2)/(x + 1)", "(x + 2)/(x − 1)", "x + 2"],
    correctIndex: 1,
    explanation: "Surat (x−2)(x+2), maxraj (x−2)(x+1). Umumiy ko‘paytuvchi qisqargach (x+2)/(x+1) qoladi.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 8,
    topicId: "math-algebra-transformations",
    prompt: "α o‘tkir burchak va tg α = 3/4 bo‘lsa, sin α ni toping.",
    options: ["3/5", "4/5", "3/4", "5/4"],
    correctIndex: 0,
    explanation: "Katetlar 3 va 4 nisbatda bo‘lsa, gipotenuza 5. Shuning uchun sin α = 3/5.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 9,
    topicId: "math-algebra-transformations",
    prompt: "log₂(x − 1) = 3 tenglamani yeching.",
    options: ["7", "8", "9", "10"],
    correctIndex: 2,
    explanation: "x − 1 = 2³ = 8, demak x = 9.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 10,
    topicId: "math-algebra-transformations",
    prompt: "x + y = 8 va xy = 12 bo‘lsa, x² + y² ni toping.",
    options: ["32", "36", "40", "52"],
    correctIndex: 2,
    explanation: "x²+y² = (x+y)² − 2xy = 64 − 24 = 40.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 11,
    topicId: "math-algebra-transformations",
    prompt: "Geometrik progressiyada b₁ = 3 va q = 2. Dastlabki 5 ta had yig‘indisini toping.",
    options: ["63", "75", "93", "96"],
    correctIndex: 2,
    explanation: "S₅ = 3(2⁵−1)/(2−1) = 3·31 = 93.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 12,
    topicId: "math-algebra-transformations",
    prompt: "cos²15° + sin²15° ifodaning qiymatini toping.",
    options: ["0", "1/2", "1", "2"],
    correctIndex: 2,
    explanation: "Asosiy trigonometrik ayniyatga ko‘ra sin²α + cos²α = 1.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 13,
    topicId: "math-algebra-transformations",
    prompt: "Ikki sonning nisbati 3:5, yig‘indisi 64. Kichik sonni toping.",
    options: ["18", "21", "24", "40"],
    correctIndex: 2,
    explanation: "Jami 8 ulush 64 ga teng, bir ulush 8. Kichik son 3·8 = 24.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 14,
    topicId: "math-equations-inequalities",
    prompt: "x² − 9x + 20 = 0 tenglamaning katta ildizini toping.",
    options: ["4", "5", "9", "20"],
    correctIndex: 1,
    explanation: "Tenglama (x−4)(x−5)=0 ko‘rinishga keladi. Katta ildiz 5.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 15,
    topicId: "math-equations-inequalities",
    prompt: "|2x − 5| = 7 tenglama ildizlari yig‘indisini toping.",
    options: ["−1", "5", "6", "7"],
    correctIndex: 1,
    explanation: "2x−5=7 dan x=6; 2x−5=−7 dan x=−1. Yig‘indi 5.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 16,
    topicId: "math-equations-inequalities",
    prompt: "3x² − 8x − 3 = 0 tenglama ildizlari x₁ va x₂ bo‘lsa, 1/x₁ + 1/x₂ ni toping.",
    options: ["−8/3", "−3/8", "3/8", "8/3"],
    correctIndex: 0,
    explanation: "(x₁+x₂)/(x₁x₂) = (8/3)/(−1) = −8/3.",
    difficulty: "medium",
    points: 1.3,
  }),
  closedQuestion({
    position: 17,
    topicId: "math-equations-inequalities",
    prompt: "x + y = 7 va x² + y² = 29 bo‘lsa, xy ni toping.",
    options: ["8", "10", "12", "20"],
    correctIndex: 1,
    explanation: "49 = (x+y)² = x²+y²+2xy = 29+2xy. Demak xy=10.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 18,
    topicId: "math-equations-inequalities",
    prompt: "√(x + 4) < 3 tengsizlikning yechimini toping.",
    options: ["(−∞; 5)", "[−4; 5)", "(−4; 5]", "[−4; 9)"],
    correctIndex: 1,
    explanation: "Aniqlanish sohasi x≥−4. Kvadratga oshirishdan x+4<9, ya’ni x<5. Kesishma [−4;5).",
    difficulty: "medium",
    points: 1.3,
  }),
  closedQuestion({
    position: 19,
    topicId: "math-equations-inequalities",
    prompt: "(x − 2)/(x + 1) ≥ 0 tengsizlikning yechimini toping.",
    options: ["(−1; 2)", "(−∞; −1) ∪ [2; +∞)", "(−∞; −1] ∪ (2; +∞)", "[−1; 2]"],
    correctIndex: 1,
    explanation: "Kritik nuqtalar −1 va 2. Ishora tahlili natijasi (−∞;−1)∪[2;+∞); x=−1 kirmaydi.",
    difficulty: "hard",
    points: 2.2,
  }),
  closedQuestion({
    position: 20,
    topicId: "math-functions",
    prompt: "Quyidagi funksiyalardan qaysi biri toq funksiya?",
    options: ["f(x)=x³+2x", "f(x)=x²+2", "f(x)=|x|", "f(x)=cos x"],
    correctIndex: 0,
    explanation: "f(−x)=−x³−2x=−f(x), shuning uchun x³+2x toq funksiya.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 21,
    topicId: "math-functions",
    prompt: "f(x)=2x−1 va g(x)=x²+3 bo‘lsa, g(f(2)) ni toping.",
    options: ["9", "10", "12", "15"],
    correctIndex: 2,
    explanation: "f(2)=3. Shuning uchun g(f(2))=g(3)=9+3=12.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 22,
    topicId: "math-analysis",
    prompt: "f(x)=x³−3x bo‘lsa, f′(2) ni toping.",
    options: ["3", "6", "9", "12"],
    correctIndex: 2,
    explanation: "f′(x)=3x²−3. f′(2)=12−3=9.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 23,
    topicId: "math-analysis",
    prompt: "2x + 1 funksiyaning boshlang‘ich funksiyasini toping.",
    options: ["x²+x+C", "2x²+x+C", "x²+1+C", "2+C"],
    correctIndex: 0,
    explanation: "∫(2x+1)dx = x²+x+C.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 24,
    topicId: "math-geometry",
    prompt: "Uchburchakning ikki burchagi 48° va 67°. Uchinchi burchakni toping.",
    options: ["55°", "65°", "75°", "85°"],
    correctIndex: 1,
    explanation: "Uchburchak burchaklari yig‘indisi 180°. 180−48−67=65°.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 25,
    topicId: "math-geometry",
    prompt: "Katetlari 5 cm va 12 cm bo‘lgan to‘g‘ri burchakli uchburchak gipotenuzasini toping.",
    options: ["11 cm", "13 cm", "15 cm", "17 cm"],
    correctIndex: 1,
    explanation: "c=√(5²+12²)=√169=13 cm.",
    difficulty: "easy",
    points: 1.3,
  }),
  closedQuestion({
    position: 26,
    topicId: "math-geometry",
    prompt: "Radiusi 5 cm bo‘lgan doiraning yuzini toping.",
    options: ["10π cm²", "20π cm²", "25π cm²", "50π cm²"],
    correctIndex: 2,
    explanation: "S=πr²=π·25=25π cm².",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 27,
    topicId: "math-geometry",
    prompt: "O‘xshash ikki uchburchakning mos tomonlari nisbati 2:3. Ularning yuzlari nisbatini toping.",
    options: ["2:3", "4:9", "6:9", "8:27"],
    correctIndex: 1,
    explanation: "O‘xshash shakllar yuzlari chiziqli nisbat kvadratiga teng: 2²:3²=4:9.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 28,
    topicId: "math-geometry",
    prompt: "a=(3;4) vektorning uzunligini toping.",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "|a|=√(3²+4²)=5.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 29,
    topicId: "math-geometry",
    prompt: "Radiusi 3 cm, balandligi 5 cm bo‘lgan silindr hajmini toping.",
    options: ["15π cm³", "30π cm³", "45π cm³", "90π cm³"],
    correctIndex: 2,
    explanation: "V=πr²h=π·9·5=45π cm³.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 30,
    topicId: "math-geometry",
    prompt: "A(−2;4) va B(6;−2) nuqtalarni tutashtirgan kesmaning o‘rta nuqtasini toping.",
    options: ["(2;1)", "(4;2)", "(2;−1)", "(−4;6)"],
    correctIndex: 0,
    explanation: "O‘rta nuqta ((−2+6)/2;(4−2)/2)=(2;1).",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 31,
    topicId: "math-probability-data",
    prompt: "2, 5, 7, 7, 9 sonlar qatorining medianasini toping.",
    options: ["5", "6", "7", "9"],
    correctIndex: 2,
    explanation: "Tartiblangan 5 ta sonning o‘rtasidagi qiymat 7.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 32,
    topicId: "math-probability-data",
    prompt: "Qutida 5 ta oq va 3 ta qora shar bor. Tasodifiy olingan bitta sharning qora bo‘lish ehtimolini toping.",
    options: ["3/5", "3/8", "5/8", "1/3"],
    correctIndex: 1,
    explanation: "Jami 8 ta shar, shundan 3 tasi qora. Ehtimollik 3/8.",
    difficulty: "medium",
    points: 2.2,
  }),
  closedQuestion({
    position: 33,
    topicId: "math-geometry",
    prompt: "Parallelepipedning hajmini toping.",
    options: matchingOptions,
    correctIndex: 0,
    explanation: "V=3·4·5=60 cm³.",
    difficulty: "medium",
    points: 2.2,
    type: "matching",
    context: matchingContext,
    groupId: "math-matching-box",
  }),
  closedQuestion({
    position: 34,
    topicId: "math-geometry",
    prompt: "Parallelepipedning to‘la sirt yuzini toping.",
    options: matchingOptions,
    correctIndex: 2,
    explanation: "S=2(3·4+3·5+4·5)=2(12+15+20)=94 cm².",
    difficulty: "medium",
    points: 2.2,
    type: "matching",
    context: matchingContext,
    groupId: "math-matching-box",
  }),
  closedQuestion({
    position: 35,
    topicId: "math-geometry",
    prompt: "Parallelepipedning fazoviy diagonalini toping.",
    options: matchingOptions,
    correctIndex: 4,
    explanation: "d=√(3²+4²+5²)=√50=5√2 cm.",
    difficulty: "medium",
    points: 2.2,
    type: "matching",
    context: matchingContext,
    groupId: "math-matching-box",
  }),
  openQuestion({
    position: 36,
    topicId: "math-equations-inequalities",
    prompt: "(x − 2)² = 9 tenglamani yeching.",
    difficulty: "medium",
    parts: [
      { id: "a", prompt: "Tenglama nechta haqiqiy ildizga ega?", points: 1.5, correctAnswer: "2", acceptedAnswers: ["2", "2 ta"], explanation: "x−2=±3 bo‘lgani uchun ikki ildiz bor." },
      { id: "b", prompt: "Ildizlar ko‘paytmasini toping.", points: 1.7, correctAnswer: "−5", acceptedAnswers: ["-5", "−5"], explanation: "Ildizlar 5 va −1; ko‘paytma −5." },
    ],
  }),
  openQuestion({
    position: 37,
    topicId: "math-equations-inequalities",
    prompt: "sin x = 1/2 tenglamani x ∈ [0; 2π] kesmada qarang.",
    difficulty: "hard",
    parts: [
      { id: "a", prompt: "Eng kichik musbat ildizni toping.", points: 1.5, correctAnswer: "π/6", acceptedAnswers: ["π/6", "pi/6"], explanation: "Birinchi chorakdagi yechim x=π/6." },
      { id: "b", prompt: "Kesmadagi ildizlar sonini toping.", points: 1.7, correctAnswer: "2", acceptedAnswers: ["2", "2 ta"], explanation: "Yechimlar π/6 va 5π/6, jami 2 ta." },
    ],
  }),
  openQuestion({
    position: 38,
    topicId: "math-functions",
    prompt: "f(x)=x²−4x+3 kvadrat funksiya berilgan.",
    difficulty: "medium",
    parts: [
      { id: "a", prompt: "Parabola uchining abssissasini toping.", points: 1.5, correctAnswer: "2", acceptedAnswers: ["2"], explanation: "x₀=−b/(2a)=4/2=2." },
      { id: "b", prompt: "Funksiyaning eng kichik qiymatini toping.", points: 1.7, correctAnswer: "−1", acceptedAnswers: ["-1", "−1"], explanation: "f(2)=4−8+3=−1." },
    ],
  }),
  openQuestion({
    position: 39,
    topicId: "math-analysis",
    prompt: "f(x)=x³−6x²+9x funksiya berilgan.",
    difficulty: "hard",
    parts: [
      { id: "a", prompt: "f′(1) ni toping.", points: 1.5, correctAnswer: "0", acceptedAnswers: ["0"], explanation: "f′(x)=3x²−12x+9; f′(1)=0." },
      { id: "b", prompt: "Funksiyaning kritik nuqtalari sonini toping.", points: 1.7, correctAnswer: "2", acceptedAnswers: ["2", "2 ta"], explanation: "f′(x)=3(x−1)(x−3), shuning uchun x=1 va x=3 — ikki kritik nuqta." },
    ],
  }),
  openQuestion({
    position: 40,
    topicId: "math-analysis",
    prompt: "f(x)=2x funksiya va [0;3] kesma berilgan.",
    difficulty: "medium",
    parts: [
      { id: "a", prompt: "f(3) ni toping.", points: 1.5, correctAnswer: "6", acceptedAnswers: ["6"], explanation: "f(3)=2·3=6." },
      { id: "b", prompt: "Funksiya grafigi, Ox o‘qi va x=3 chiziq orasidagi yuzni toping.", points: 1.7, correctAnswer: "9", acceptedAnswers: ["9", "9 birlik", "9 birlik²"], explanation: "S=∫₀³2x dx=x²|₀³=9." },
    ],
  }),
  openQuestion({
    position: 41,
    topicId: "math-geometry",
    prompt: "Katetlari 9 cm va 12 cm bo‘lgan to‘g‘ri burchakli uchburchak berilgan.",
    difficulty: "medium",
    parts: [
      { id: "a", prompt: "Gipotenuza uzunligini toping.", points: 1.5, correctAnswer: "15", acceptedAnswers: ["15", "15 cm"], explanation: "√(9²+12²)=√225=15." },
      { id: "b", prompt: "Uchburchak yuzini toping.", points: 1.7, correctAnswer: "54", acceptedAnswers: ["54", "54 cm2", "54 cm²"], explanation: "S=9·12/2=54 cm²." },
    ],
  }),
  openQuestion({
    position: 42,
    topicId: "math-geometry",
    prompt: "Kvadrat diagonali 10√2 cm ga teng.",
    difficulty: "medium",
    parts: [
      { id: "a", prompt: "Kvadrat tomonini toping.", points: 1.5, correctAnswer: "10", acceptedAnswers: ["10", "10 cm"], explanation: "d=a√2 dan a=10 cm." },
      { id: "b", prompt: "Kvadrat yuzini toping.", points: 1.7, correctAnswer: "100", acceptedAnswers: ["100", "100 cm2", "100 cm²"], explanation: "S=a²=100 cm²." },
    ],
  }),
  openQuestion({
    position: 43,
    topicId: "math-geometry",
    prompt: "Markazi M(4;4) nuqtada bo‘lgan aylana Ox va Oy o‘qlariga urinadi.",
    difficulty: "hard",
    parts: [
      { id: "a", prompt: "Aylana radiusini toping.", points: 1.5, correctAnswer: "4", acceptedAnswers: ["4", "4 birlik"], explanation: "Markazdan har bir koordinata o‘qigacha masofa 4." },
      { id: "b", prompt: "OM masofani toping.", points: 1.7, correctAnswer: "4√2", acceptedAnswers: ["4√2", "4sqrt2", "4*sqrt2"], explanation: "OM=√(4²+4²)=√32=4√2." },
    ],
  }),
  openQuestion({
    position: 44,
    topicId: "math-geometry",
    prompt: "Qirrasi 6 cm bo‘lgan kub berilgan.",
    difficulty: "hard",
    parts: [
      { id: "a", prompt: "Kub bir yog‘ining diagonalini toping.", points: 1.5, correctAnswer: "6√2", acceptedAnswers: ["6√2", "6sqrt2", "6*sqrt2"], explanation: "Kvadrat yuzi diagonali a√2=6√2." },
      { id: "b", prompt: "Kub hajmini toping.", points: 1.7, correctAnswer: "216", acceptedAnswers: ["216", "216 cm3", "216 cm³"], explanation: "V=a³=6³=216 cm³." },
    ],
  }),
  openQuestion({
    position: 45,
    topicId: "math-probability-data",
    prompt: "Taksi safarining narxi y=4000+2500x formula bilan hisoblanadi; x — bosib o‘tilgan kilometr.",
    difficulty: "hard",
    parts: [
      { id: "a", prompt: "6 km safar narxini toping.", points: 1.5, correctAnswer: "19000", acceptedAnswers: ["19000", "19 000", "19000 so‘m", "19 000 so‘m"], explanation: "y=4000+2500·6=19 000 so‘m." },
      { id: "b", prompt: "Safar narxi 29 000 so‘m bo‘lsa, masofani toping.", points: 1.7, correctAnswer: "10", acceptedAnswers: ["10", "10 km"], explanation: "29 000=4000+2500x dan x=10 km." },
    ],
  }),
];

export const PUBLISHED_MATH_MOCK_QUESTIONS = MATH_MOCK_QUESTIONS.filter(
  (question) => question.reviewStatus === "published"
);

export const MATH_MOCK_REVIEW_QUESTIONS = MATH_MOCK_QUESTIONS.filter(
  (question) => question.reviewStatus === "review"
);
