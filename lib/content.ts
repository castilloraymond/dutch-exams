import type { ContentIndex, Passage, KNMIndex, KNMTopic, ListeningIndex, ListeningExercise } from "./types";

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

const passages: Record<string, Passage> = {
  "de-supermarkt": deSupermarkt as Passage,
  "op-het-station": opHetStation as Passage,
  "bij-de-dokter": bijDeDokter as Passage,
  "een-brief": eenBrief as Passage,
  "de-buurt": deBuurt as Passage,
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
  "bij-de-bakker": bijDeBakker as ListeningExercise,
  "op-het-gemeentehuis": opHetGemeentehuis as ListeningExercise,
  "een-telefoongesprek": eenTelefoongesprek as ListeningExercise,
  "bij-de-huisarts": bijDeHuisarts as ListeningExercise,
  "op-het-werk": opHetWerk as ListeningExercise,
};

// Lezen functions
export function getContentIndex(): ContentIndex {
  return contentIndex as ContentIndex;
}

export function getPassage(id: string): Passage | null {
  return passages[id] || null;
}

export function getAllPassageIds(): string[] {
  return Object.keys(passages);
}

// KNM functions
export function getKNMIndex(): KNMIndex {
  return knmIndex as KNMIndex;
}

export function getKNMTopic(id: string): KNMTopic | null {
  return knmTopics[id] || null;
}

// Luisteren functions
export function getListeningIndex(): ListeningIndex {
  return luisterenIndex as ListeningIndex;
}

export function getListeningExercise(id: string): ListeningExercise | null {
  return listeningExercises[id] || null;
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
