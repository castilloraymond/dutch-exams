import type { ContentIndex, Passage } from "./types";

import contentIndex from "@/content/index.json";
import deSupermarkt from "@/content/passages/de-supermarkt.json";
import opHetStation from "@/content/passages/op-het-station.json";
import bijDeDokter from "@/content/passages/bij-de-dokter.json";
import eenBrief from "@/content/passages/een-brief.json";
import deBuurt from "@/content/passages/de-buurt.json";

const passages: Record<string, Passage> = {
  "de-supermarkt": deSupermarkt as Passage,
  "op-het-station": opHetStation as Passage,
  "bij-de-dokter": bijDeDokter as Passage,
  "een-brief": eenBrief as Passage,
  "de-buurt": deBuurt as Passage,
};

export function getContentIndex(): ContentIndex {
  return contentIndex as ContentIndex;
}

export function getPassage(id: string): Passage | null {
  return passages[id] || null;
}

export function getAllPassageIds(): string[] {
  return Object.keys(passages);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
