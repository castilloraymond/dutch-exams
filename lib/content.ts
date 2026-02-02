import type { ContentIndex, Passage, KNMIndex, KNMTopic, ListeningIndex, ListeningExercise, Question, MockExamIndex, MockExam } from "./types";

// Lezen (Reading) content
import contentIndex from "@/content/index.json";
import deSupermarkt from "@/content/passages/de-supermarkt.json";
import opHetStation from "@/content/passages/op-het-station.json";
import bijDeDokter from "@/content/passages/bij-de-dokter.json";
import eenBrief from "@/content/passages/een-brief.json";
import deBuurt from "@/content/passages/de-buurt.json";

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

// Mock exam content - Lezen
import lezenMockIndex from "@/content/mock-exams/lezen/index.json";
import lezenA1Exam1 from "@/content/mock-exams/lezen/a1-exam-1.json";
import lezenA1Exam2 from "@/content/mock-exams/lezen/a1-exam-2.json";
import lezenA2Exam1 from "@/content/mock-exams/lezen/a2-exam-1.json";
import lezenA2Exam2 from "@/content/mock-exams/lezen/a2-exam-2.json";

// Mock exam content - KNM
import knmMockIndex from "@/content/mock-exams/knm/index.json";
import knmA1Exam1 from "@/content/mock-exams/knm/a1-exam-1.json";
import knmA1Exam2 from "@/content/mock-exams/knm/a1-exam-2.json";
import knmA2Exam1 from "@/content/mock-exams/knm/a2-exam-1.json";
import knmA2Exam2 from "@/content/mock-exams/knm/a2-exam-2.json";

// Mock exam content - Luisteren
import luisterenMockIndex from "@/content/mock-exams/luisteren/index.json";
import luisterenA1Exam1 from "@/content/mock-exams/luisteren/a1-exam-1.json";
import luisterenA1Exam2 from "@/content/mock-exams/luisteren/a1-exam-2.json";
import luisterenA2Exam1 from "@/content/mock-exams/luisteren/a2-exam-1.json";
import luisterenA2Exam2 from "@/content/mock-exams/luisteren/a2-exam-2.json";
import luisterenA2Exam3 from "@/content/mock-exams/luisteren/a2-exam-3.json";
import luisterenA2Exam4 from "@/content/mock-exams/luisteren/a2-exam-4.json";

const passages: Record<string, Passage> = {
  "tips-om-goed-te-leren": deSupermarkt as unknown as Passage,
  "brief-van-de-gemeente": opHetStation as unknown as Passage,
  "advertentie-cursus-nederlands": bijDeDokter as unknown as Passage,
  "artikel-fietsen-in-nederland": eenBrief as unknown as Passage,
  "huisregels-appartementencomplex": deBuurt as unknown as Passage,
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
  "knm-a1-1": knmA1Exam1 as unknown as MockExam,
  "knm-a1-2": knmA1Exam2 as unknown as MockExam,
  "knm-a2-1": knmA2Exam1 as unknown as MockExam,
  "knm-a2-2": knmA2Exam2 as unknown as MockExam,
  "luisteren-a1-1": luisterenA1Exam1 as unknown as MockExam,
  "luisteren-a1-2": luisterenA1Exam2 as unknown as MockExam,
  "luisteren-a2-1": luisterenA2Exam1 as unknown as MockExam,
  "luisteren-a2-2": luisterenA2Exam2 as unknown as MockExam,
  "luisteren-a2-3": luisterenA2Exam3 as unknown as MockExam,
  "luisteren-a2-4": luisterenA2Exam4 as unknown as MockExam,
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
