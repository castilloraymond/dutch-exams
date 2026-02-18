import type {
  ContentIndex,
  Passage,
  KNMIndex,
  KNMTopic,
  ListeningIndex,
  ListeningExercise,
  Question,
  MockExamIndex,
  MockExam,
  QuickAssessmentModule,
  WritingIndex,
  WritingTask,
  WritingTaskSummary,
  SpeakingIndex,
  SpeakingTask,
  SpeakingTaskSummary,
  SpeakingPartNumber,
} from "./types";

// Lezen (Reading) content
import contentIndex from "@/content/index.json";
import tipsOmGoedTeLeren from "@/content/passages/tips-om-goed-te-leren.json";
import briefVanDeGemeente from "@/content/passages/brief-van-de-gemeente.json";
import advertentieCursusNederlands from "@/content/passages/advertentie-cursus-nederlands.json";
import artikelFietsenInNederland from "@/content/passages/artikel-fietsen-in-nederland.json";
import huisregelsAppartementencomplex from "@/content/passages/huisregels-appartementencomplex.json";
import openingstijdenWinkelcentrum from "@/content/passages/openingstijden-winkelcentrum.json";
import uitnodigingVerjaardagsfeest from "@/content/passages/uitnodiging-verjaardagsfeest.json";
import roosterTaallessen from "@/content/passages/rooster-taallessen.json";
import informatieBibliotheek from "@/content/passages/informatie-bibliotheek.json";
import nieuwsbriefSchool from "@/content/passages/nieuwsbrief-school.json";

// KNM content
import knmIndex from "@/content/knm/index.json";
import knmWerk from "@/content/knm/topics/werk.json";
import knmWonen from "@/content/knm/topics/wonen.json";
import knmGezondheid from "@/content/knm/topics/gezondheid.json";
import knmGeschiedenis from "@/content/knm/topics/geschiedenis.json";
import knmOnderwijs from "@/content/knm/topics/onderwijs.json";
import knmNormenEnWaarden from "@/content/knm/topics/normen-en-waarden.json";
import knmPolitiek from "@/content/knm/topics/politiek.json";
import knmGeografie from "@/content/knm/topics/geografie.json";

// Luisteren content
import luisterenIndex from "@/content/luisteren/index.json";
import bijDeBakker from "@/content/luisteren/exercises/bij-de-bakker.json";
import opHetGemeentehuis from "@/content/luisteren/exercises/op-het-gemeentehuis.json";
import eenTelefoongesprek from "@/content/luisteren/exercises/een-telefoongesprek.json";
import bijDeHuisarts from "@/content/luisteren/exercises/bij-de-huisarts.json";
import opHetWerk from "@/content/luisteren/exercises/op-het-werk.json";
import inDeSupermarkt from "@/content/luisteren/exercises/in-de-supermarkt.json";
import opSchool from "@/content/luisteren/exercises/op-school.json";
import bijHetUitzendbureau from "@/content/luisteren/exercises/bij-het-uitzendbureau.json";
import eenAfspraakMaken from "@/content/luisteren/exercises/een-afspraak-maken.json";
import inDeTrein from "@/content/luisteren/exercises/in-de-trein.json";

// Mock exam content - Lezen
import lezenMockIndex from "@/content/mock-exams/lezen/index.json";
import lezenA1Exam1 from "@/content/mock-exams/lezen/a1-exam-1.json";
import lezenA1Exam2 from "@/content/mock-exams/lezen/a1-exam-2.json";
import lezenA2Exam1 from "@/content/mock-exams/lezen/a2-exam-1.json";
import lezenA2Exam2 from "@/content/mock-exams/lezen/a2-exam-2.json";
import lezenA1Exam3 from "@/content/mock-exams/lezen/a1-exam-3.json";
import lezenA1Exam4 from "@/content/mock-exams/lezen/a1-exam-4.json";
import lezenA2Exam3 from "@/content/mock-exams/lezen/a2-exam-3.json";
import lezenA2Exam4 from "@/content/mock-exams/lezen/a2-exam-4.json";
import lezenB1Exam1 from "@/content/mock-exams/lezen/b1-exam-1.json";
import lezenB1Exam2 from "@/content/mock-exams/lezen/b1-exam-2.json";

// Mock exam content - KNM
import knmMockIndex from "@/content/mock-exams/knm/index.json";
import knmA1Exam1 from "@/content/mock-exams/knm/a1-exam-1.json";
import knmA1Exam2 from "@/content/mock-exams/knm/a1-exam-2.json";
import knmA2Exam1 from "@/content/mock-exams/knm/a2-exam-1.json";
import knmA2Exam2 from "@/content/mock-exams/knm/a2-exam-2.json";
import knmA1Exam3 from "@/content/mock-exams/knm/a1-exam-3.json";
import knmA1Exam4 from "@/content/mock-exams/knm/a1-exam-4.json";
import knmA2Exam3 from "@/content/mock-exams/knm/a2-exam-3.json";
import knmA2Exam4 from "@/content/mock-exams/knm/a2-exam-4.json";
import knmB1Exam1 from "@/content/mock-exams/knm/b1-exam-1.json";
import knmB1Exam2 from "@/content/mock-exams/knm/b1-exam-2.json";

// Mock exam content - Luisteren
import luisterenMockIndex from "@/content/mock-exams/luisteren/index.json";
import luisterenA1Exam1 from "@/content/mock-exams/luisteren/a1-exam-1.json";
import luisterenA1Exam2 from "@/content/mock-exams/luisteren/a1-exam-2.json";
import luisterenA2Exam1 from "@/content/mock-exams/luisteren/a2-exam-1.json";
import luisterenA2Exam2 from "@/content/mock-exams/luisteren/a2-exam-2.json";
import luisterenA2Exam3 from "@/content/mock-exams/luisteren/a2-exam-3.json";
import luisterenA2Exam4 from "@/content/mock-exams/luisteren/a2-exam-4.json";
import luisterenA1Exam3 from "@/content/mock-exams/luisteren/a1-exam-3.json";
import luisterenA1Exam4 from "@/content/mock-exams/luisteren/a1-exam-4.json";
import luisterenA2Exam5 from "@/content/mock-exams/luisteren/a2-exam-5.json";
import luisterenA2Exam6 from "@/content/mock-exams/luisteren/a2-exam-6.json";
import luisterenA2Exam7 from "@/content/mock-exams/luisteren/a2-exam-7.json";
import luisterenA2Exam8 from "@/content/mock-exams/luisteren/a2-exam-8.json";

// Quick Assessment content
import quickAssessmentIndex from "@/content/quick-assessment/index.json";
import quickAssessmentKnm from "@/content/quick-assessment/knm.json";
import quickAssessmentLezen from "@/content/quick-assessment/lezen.json";
import quickAssessmentLuisteren from "@/content/quick-assessment/luisteren.json";
import quickAssessmentSchrijven from "@/content/quick-assessment/schrijven.json";
import quickAssessmentSpreken from "@/content/quick-assessment/spreken.json";

// Schrijven content
import schrijvenIndex from "@/content/schrijven/index.json";
import emailSchoolSick from "@/content/schrijven/tasks/email-school-sick.json";
import messageLandlordRepair from "@/content/schrijven/tasks/message-landlord-repair.json";
import formCourseRegistration from "@/content/schrijven/tasks/form-course-registration.json";
import replyColleagueShift from "@/content/schrijven/tasks/reply-colleague-shift.json";
import formGpRegistration from "@/content/schrijven/tasks/form-gp-registration.json";
import noteNeighbor from "@/content/schrijven/tasks/note-neighbor.json";
import complaintWebshop from "@/content/schrijven/tasks/complaint-webshop.json";
import messageTeacherAbsence from "@/content/schrijven/tasks/message-teacher-absence.json";

// Spreken content
import sprekenIndex from "@/content/spreken/index.json";
import part1Homework from "@/content/spreken/tasks/part1-homework.json";
import part2Lunch from "@/content/spreken/tasks/part2-lunch.json";
import part3Education from "@/content/spreken/tasks/part3-education.json";
import part4Classroom from "@/content/spreken/tasks/part4-classroom.json";
import part1DailyRoutine from "@/content/spreken/tasks/part1-daily-routine.json";
import part2Market from "@/content/spreken/tasks/part2-market.json";
import part3Transport from "@/content/spreken/tasks/part3-transport.json";
import part4Kitchen from "@/content/spreken/tasks/part4-kitchen.json";
import a1Part1Family from "@/content/spreken/tasks/a1-part1-family.json";
import a1Part2Food from "@/content/spreken/tasks/a1-part2-food.json";
import a1Part3Rooms from "@/content/spreken/tasks/a1-part3-rooms.json";
import a1Part4Morning from "@/content/spreken/tasks/a1-part4-morning.json";

const passages: Record<string, Passage> = {
  "tips-om-goed-te-leren": tipsOmGoedTeLeren as unknown as Passage,
  "brief-van-de-gemeente": briefVanDeGemeente as unknown as Passage,
  "advertentie-cursus-nederlands": advertentieCursusNederlands as unknown as Passage,
  "artikel-fietsen-in-nederland": artikelFietsenInNederland as unknown as Passage,
  "huisregels-appartementencomplex": huisregelsAppartementencomplex as unknown as Passage,
  "openingstijden-winkelcentrum": openingstijdenWinkelcentrum as unknown as Passage,
  "uitnodiging-verjaardagsfeest": uitnodigingVerjaardagsfeest as unknown as Passage,
  "rooster-taallessen": roosterTaallessen as unknown as Passage,
  "informatie-bibliotheek": informatieBibliotheek as unknown as Passage,
  "nieuwsbrief-school": nieuwsbriefSchool as unknown as Passage,
};

const knmTopics: Record<string, KNMTopic> = {
  "werk": knmWerk as KNMTopic,
  "wonen": knmWonen as KNMTopic,
  "gezondheid": knmGezondheid as KNMTopic,
  "geschiedenis": knmGeschiedenis as KNMTopic,
  "onderwijs": knmOnderwijs as KNMTopic,
  "normen-en-waarden": knmNormenEnWaarden as KNMTopic,
  "politiek": knmPolitiek as KNMTopic,
  "geografie": knmGeografie as KNMTopic,
};

const listeningExercises: Record<string, ListeningExercise> = {
  "bij-de-bakker": bijDeBakker as unknown as ListeningExercise,
  "op-het-gemeentehuis": opHetGemeentehuis as unknown as ListeningExercise,
  "een-telefoongesprek": eenTelefoongesprek as unknown as ListeningExercise,
  "bij-de-huisarts": bijDeHuisarts as unknown as ListeningExercise,
  "op-het-werk": opHetWerk as unknown as ListeningExercise,
  "in-de-supermarkt": inDeSupermarkt as unknown as ListeningExercise,
  "op-school": opSchool as unknown as ListeningExercise,
  "bij-het-uitzendbureau": bijHetUitzendbureau as unknown as ListeningExercise,
  "een-afspraak-maken": eenAfspraakMaken as unknown as ListeningExercise,
  "in-de-trein": inDeTrein as unknown as ListeningExercise,
};

// Mock exam data
const mockExamIndices: Record<string, MockExamIndex> = {
  lezen: lezenMockIndex as MockExamIndex,
  knm: knmMockIndex as MockExamIndex,
  luisteren: luisterenMockIndex as MockExamIndex,
};

const mockExams: Record<string, MockExam> = {
  "lezen-a1-1": lezenA1Exam1 as unknown as MockExam,
  "lezen-a1-2": lezenA1Exam2 as unknown as MockExam,
  "lezen-a2-1": lezenA2Exam1 as unknown as MockExam,
  "lezen-a2-2": lezenA2Exam2 as unknown as MockExam,
  "lezen-a1-3": lezenA1Exam3 as unknown as MockExam,
  "lezen-a1-4": lezenA1Exam4 as unknown as MockExam,
  "lezen-a2-3": lezenA2Exam3 as unknown as MockExam,
  "lezen-a2-4": lezenA2Exam4 as unknown as MockExam,
  "lezen-b1-1": lezenB1Exam1 as unknown as MockExam,
  "lezen-b1-2": lezenB1Exam2 as unknown as MockExam,
  "knm-a1-1": knmA1Exam1 as unknown as MockExam,
  "knm-a1-2": knmA1Exam2 as unknown as MockExam,
  "knm-a2-1": knmA2Exam1 as unknown as MockExam,
  "knm-a2-2": knmA2Exam2 as unknown as MockExam,
  "knm-a1-3": knmA1Exam3 as unknown as MockExam,
  "knm-a1-4": knmA1Exam4 as unknown as MockExam,
  "knm-a2-3": knmA2Exam3 as unknown as MockExam,
  "knm-a2-4": knmA2Exam4 as unknown as MockExam,
  "knm-b1-1": knmB1Exam1 as unknown as MockExam,
  "knm-b1-2": knmB1Exam2 as unknown as MockExam,
  "luisteren-a1-1": luisterenA1Exam1 as unknown as MockExam,
  "luisteren-a1-2": luisterenA1Exam2 as unknown as MockExam,
  "luisteren-a2-1": luisterenA2Exam1 as unknown as MockExam,
  "luisteren-a2-2": luisterenA2Exam2 as unknown as MockExam,
  "luisteren-a2-3": luisterenA2Exam3 as unknown as MockExam,
  "luisteren-a2-4": luisterenA2Exam4 as unknown as MockExam,
  "luisteren-a1-3": luisterenA1Exam3 as unknown as MockExam,
  "luisteren-a1-4": luisterenA1Exam4 as unknown as MockExam,
  "luisteren-a2-5": luisterenA2Exam5 as unknown as MockExam,
  "luisteren-a2-6": luisterenA2Exam6 as unknown as MockExam,
  "luisteren-a2-7": luisterenA2Exam7 as unknown as MockExam,
  "luisteren-a2-8": luisterenA2Exam8 as unknown as MockExam,
};

// Schrijven data
const writingTasks: Record<string, WritingTask> = {
  "email-school-sick": emailSchoolSick as unknown as WritingTask,
  "message-landlord-repair": messageLandlordRepair as unknown as WritingTask,
  "form-course-registration": formCourseRegistration as unknown as WritingTask,
  "reply-colleague-shift": replyColleagueShift as unknown as WritingTask,
  "form-gp-registration": formGpRegistration as unknown as WritingTask,
  "note-neighbor": noteNeighbor as unknown as WritingTask,
  "complaint-webshop": complaintWebshop as unknown as WritingTask,
  "message-teacher-absence": messageTeacherAbsence as unknown as WritingTask,
};

// Spreken data
const speakingTasks: Record<string, SpeakingTask> = {
  "a1-part1-family": a1Part1Family as unknown as SpeakingTask,
  "a1-part2-food": a1Part2Food as unknown as SpeakingTask,
  "a1-part3-rooms": a1Part3Rooms as unknown as SpeakingTask,
  "a1-part4-morning": a1Part4Morning as unknown as SpeakingTask,
  "part1-homework": part1Homework as unknown as SpeakingTask,
  "part2-lunch": part2Lunch as unknown as SpeakingTask,
  "part3-education": part3Education as unknown as SpeakingTask,
  "part4-classroom": part4Classroom as unknown as SpeakingTask,
  "part1-daily-routine": part1DailyRoutine as unknown as SpeakingTask,
  "part2-market": part2Market as unknown as SpeakingTask,
  "part3-transport": part3Transport as unknown as SpeakingTask,
  "part4-kitchen": part4Kitchen as unknown as SpeakingTask,
};

// Lezen functions
export function getContentIndex(): ContentIndex {
  return contentIndex as unknown as ContentIndex;
}

export function getPassage(id: string): Passage | null {
  return passages[id] || null;
}

export function getAllPassageIds(): string[] {
  return Object.keys(passages);
}

export function getAllPassages(): Passage[] {
  return Object.values(passages);
}

// Get all questions from all passages for the Lezen mock exam
export function getLezenExamQuestions(): { passage: Passage; question: Question }[] {
  const allQuestions: { passage: Passage; question: Question }[] = [];
  for (const passage of Object.values(passages)) {
    for (const question of passage.questions) {
      allQuestions.push({ passage, question });
    }
  }
  return allQuestions;
}

// KNM functions
export function getKNMIndex(): KNMIndex {
  return knmIndex as KNMIndex;
}

export function getKNMTopic(id: string): KNMTopic | null {
  return knmTopics[id] || null;
}

export function getAllKNMTopics(): KNMTopic[] {
  return Object.values(knmTopics);
}

// Get all questions from all KNM topics for the KNM mock exam
export function getKNMExamQuestions(): { topic: KNMTopic; question: Question }[] {
  const allQuestions: { topic: KNMTopic; question: Question }[] = [];
  for (const topic of Object.values(knmTopics)) {
    for (const question of topic.questions) {
      allQuestions.push({ topic, question });
    }
  }
  return allQuestions;
}

// Luisteren functions
export function getListeningIndex(): ListeningIndex {
  return luisterenIndex as unknown as ListeningIndex;
}

export function getListeningExercise(id: string): ListeningExercise | null {
  return listeningExercises[id] || null;
}

export function getAllListeningExercises(): ListeningExercise[] {
  return Object.values(listeningExercises);
}

// Get all questions from all listening exercises for the Luisteren mock exam
export function getLuisterenExamQuestions(): { exercise: ListeningExercise; question: Question }[] {
  const allQuestions: { exercise: ListeningExercise; question: Question }[] = [];
  for (const exercise of Object.values(listeningExercises)) {
    for (const question of exercise.questions) {
      allQuestions.push({ exercise, question });
    }
  }
  return allQuestions;
}

// Mock Exam functions
export function getMockExamIndex(module: string): MockExamIndex | null {
  return mockExamIndices[module] || null;
}

export function getMockExam(examId: string): MockExam | null {
  return mockExams[examId] || null;
}

export function getAllMockExamIds(): string[] {
  return Object.keys(mockExams);
}

// Utility
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get suggested exams excluding the current one and optionally filtering by completed
export interface SuggestedExamInfo {
  id: string;
  title: string;
  module: "lezen" | "knm" | "luisteren";
  difficulty: string;
  href: string;
}

export function getSuggestedExams(
  currentExamId: string,
  completedExamIds: string[] = []
): SuggestedExamInfo[] {
  const allExams: SuggestedExamInfo[] = [];

  // Add all exams from all modules
  for (const [module, index] of Object.entries(mockExamIndices)) {
    for (const exam of index.exams) {
      const fullId = exam.id;
      if (fullId !== currentExamId && !completedExamIds.includes(fullId)) {
        allExams.push({
          id: fullId,
          title: exam.title,
          module: module as "lezen" | "knm" | "luisteren",
          difficulty: exam.difficulty,
          href: `/learn/${module}/mock/${fullId}`,
        });
      }
    }
  }

  // Shuffle and return
  return shuffleArray(allExams);
}

export function getAllExamCount(): number {
  let count = 0;
  for (const index of Object.values(mockExamIndices)) {
    count += index.exams.length;
  }
  return count;
}

// ============================================
// Quick Assessment functions
// ============================================

export interface QuickAssessmentModuleInfo {
  module: QuickAssessmentModule;
  name: string;
  nameEnglish: string;
  description: string;
  estimatedMinutes: number;
  icon: string;
  taskType: "mcq" | "task";
}

export function getQuickAssessmentModules(): QuickAssessmentModuleInfo[] {
  return quickAssessmentIndex.modules as QuickAssessmentModuleInfo[];
}

// MCQ module question IDs
const quickAssessmentQuestionIds: Partial<Record<QuickAssessmentModule, string[]>> = {
  knm: quickAssessmentKnm.questionIds,
  lezen: quickAssessmentLezen.questionIds,
  luisteren: quickAssessmentLuisteren.questionIds,
};

// Build a map of all questions by ID for quick lookup
function buildQuestionMap(): Record<string, Question & { context?: { passageContent?: string; passageTitle?: string; transcript?: string; audioFile?: string } }> {
  const questionMap: Record<string, Question & { context?: { passageContent?: string; passageTitle?: string; transcript?: string; audioFile?: string } }> = {};

  // Add passage questions (lezen)
  for (const passage of Object.values(passages)) {
    for (const question of passage.questions) {
      questionMap[question.id] = {
        ...question,
        context: {
          passageContent: passage.content,
          passageTitle: passage.title,
        },
      };
    }
  }

  // Add KNM questions
  for (const topic of Object.values(knmTopics)) {
    for (const question of topic.questions) {
      questionMap[question.id] = question;
    }
  }

  // Add listening questions
  for (const exercise of Object.values(listeningExercises)) {
    for (const question of exercise.questions) {
      questionMap[question.id] = {
        ...question,
        context: {
          transcript: exercise.transcript,
          audioFile: exercise.audioFile,
        },
      };
    }
  }

  return questionMap;
}

const allQuestionsMap = buildQuestionMap();

export interface QuickAssessmentQuestion extends Question {
  context?: {
    passageContent?: string;
    passageTitle?: string;
    transcript?: string;
    audioFile?: string;
  };
}

export function getQuickAssessmentQuestions(module: QuickAssessmentModule): QuickAssessmentQuestion[] {
  const questionIds = quickAssessmentQuestionIds[module];
  if (!questionIds) return [];

  return questionIds
    .map((id) => allQuestionsMap[id])
    .filter((q): q is QuickAssessmentQuestion => q !== undefined);
}

// Quick Assessment - Writing task getter
export function getQuickAssessmentWritingTask(): WritingTask | null {
  const taskId = quickAssessmentSchrijven.taskId;
  return writingTasks[taskId] || null;
}

// Quick Assessment - Speaking task getter
export function getQuickAssessmentSpeakingTask(): SpeakingTask | null {
  const taskId = quickAssessmentSpreken.taskId;
  return speakingTasks[taskId] || null;
}

// ============================================
// Schrijven (Writing) functions
// ============================================

export function getWritingIndex(): WritingIndex {
  return schrijvenIndex as WritingIndex;
}

export function getWritingTask(id: string): WritingTask | null {
  return writingTasks[id] || null;
}

export function getAllWritingTasks(): WritingTask[] {
  return Object.values(writingTasks);
}

export function getWritingTaskSummaries(): WritingTaskSummary[] {
  return (schrijvenIndex as WritingIndex).tasks;
}

export function getFreeWritingTasks(): WritingTask[] {
  return Object.values(writingTasks).filter((task) => task.isFreePreview);
}

// ============================================
// Spreken (Speaking) functions
// ============================================

export function getSpeakingIndex(): SpeakingIndex {
  return sprekenIndex as SpeakingIndex;
}

export function getSpeakingTask(id: string): SpeakingTask | null {
  return speakingTasks[id] || null;
}

export function getAllSpeakingTasks(): SpeakingTask[] {
  return Object.values(speakingTasks);
}

export function getSpeakingTaskSummaries(): SpeakingTaskSummary[] {
  return (sprekenIndex as SpeakingIndex).tasks;
}

export function getSpeakingTasksByPart(partNumber: SpeakingPartNumber): SpeakingTask[] {
  return Object.values(speakingTasks).filter((task) => task.partNumber === partNumber);
}

export function getFreeSpeakingTasks(): SpeakingTask[] {
  return Object.values(speakingTasks).filter((task) => task.isFreePreview);
}
