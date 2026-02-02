/**
 * Google Cloud Text-to-Speech audio generation script
 *
 * Generates MP3 files for Luisteren exercises using Google Cloud TTS.
 * Uses different voices for different speakers to create natural dialogues.
 *
 * Prerequisites:
 * 1. Enable Text-to-Speech API in Google Cloud Console
 * 2. Create service account and download JSON key
 * 3. Set GOOGLE_APPLICATION_CREDENTIALS env var to path of JSON key
 *
 * Usage: npm run generate-audio:google
 */

import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// Voice mapping for speakers
// nl-NL-Wavenet voices: A (Female), B (Male), C (Male), D (Female), E (Female)
const VOICE_MAP: Record<string, { name: string; gender: "FEMALE" | "MALE" }> = {
  // Female voices
  klant: { name: "nl-NL-Wavenet-D", gender: "FEMALE" },
  patiënt: { name: "nl-NL-Wavenet-D", gender: "FEMALE" },
  patient: { name: "nl-NL-Wavenet-D", gender: "FEMALE" },
  assistente: { name: "nl-NL-Wavenet-A", gender: "FEMALE" },
  persoon: { name: "nl-NL-Wavenet-E", gender: "FEMALE" },

  // Male voices
  bakker: { name: "nl-NL-Wavenet-B", gender: "MALE" },
  dokter: { name: "nl-NL-Wavenet-C", gender: "MALE" },
  medewerker: { name: "nl-NL-Wavenet-B", gender: "MALE" },
};

// Default voices for unknown speakers
const DEFAULT_FEMALE = { name: "nl-NL-Wavenet-D", gender: "FEMALE" as const };
const DEFAULT_MALE = { name: "nl-NL-Wavenet-B", gender: "MALE" as const };

interface DialogueSegment {
  speaker: string;
  text: string;
}

interface Exercise {
  id: string;
  title: string;
  transcript: string;
}

/**
 * Parse dialogue transcript into segments with speaker info
 */
function parseDialogue(transcript: string): DialogueSegment[] {
  const segments: DialogueSegment[] = [];

  // Split by speaker pattern: "Speaker: text"
  const speakerPattern = /(?:^|(?<=[.!?]\s*))([A-Za-zÀ-ÿ]+):\s*/g;

  let lastIndex = 0;
  let currentSpeaker = "";
  const matches = [...transcript.matchAll(speakerPattern)];

  for (const match of matches) {
    if (match.index! > lastIndex && currentSpeaker) {
      const text = transcript.slice(lastIndex, match.index).trim();
      if (text) {
        segments.push({ speaker: currentSpeaker, text });
      }
    }
    currentSpeaker = match[1].toLowerCase();
    lastIndex = match.index! + match[0].length;
  }

  // Add final segment
  if (lastIndex < transcript.length && currentSpeaker) {
    const text = transcript.slice(lastIndex).trim();
    if (text) {
      segments.push({ speaker: currentSpeaker, text });
    }
  }

  return segments;
}

/**
 * Get voice configuration for a speaker
 */
function getVoice(speaker: string, speakerIndex: number): { name: string; gender: "FEMALE" | "MALE" } {
  const lowerSpeaker = speaker.toLowerCase();
  if (VOICE_MAP[lowerSpeaker]) {
    return VOICE_MAP[lowerSpeaker];
  }
  // Alternate between male and female for unknown speakers
  return speakerIndex % 2 === 0 ? DEFAULT_FEMALE : DEFAULT_MALE;
}

/**
 * Build SSML for multi-voice dialogue
 */
function buildSSML(segments: DialogueSegment[]): string {
  // Track unique speakers for voice assignment
  const speakerOrder: string[] = [];
  segments.forEach(seg => {
    if (!speakerOrder.includes(seg.speaker)) {
      speakerOrder.push(seg.speaker);
    }
  });

  let ssml = "<speak>";

  for (const segment of segments) {
    const speakerIndex = speakerOrder.indexOf(segment.speaker);
    const voice = getVoice(segment.speaker, speakerIndex);

    // Escape special XML characters
    const escapedText = segment.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    ssml += `<voice name="${voice.name}">`;
    ssml += `<prosody rate="95%">${escapedText}</prosody>`;
    ssml += "</voice>";
    ssml += '<break time="400ms"/>';
  }

  ssml += "</speak>";
  return ssml;
}

/**
 * Generate audio for a single exercise
 */
async function generateAudio(
  client: TextToSpeechClient,
  exercise: Exercise,
  outputDir: string
): Promise<void> {
  console.log(`Generating audio for: ${exercise.title}`);

  const segments = parseDialogue(exercise.transcript);
  console.log(`  Found ${segments.length} dialogue segments`);

  const ssml = buildSSML(segments);

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { ssml },
    voice: {
      languageCode: "nl-NL",
      // Primary voice (will be overridden by SSML voice tags)
      name: "nl-NL-Wavenet-D",
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 1.0,
      pitch: 0,
      sampleRateHertz: 24000,
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    if (response.audioContent) {
      const outputPath = path.join(outputDir, `${exercise.id}.mp3`);
      fs.writeFileSync(outputPath, response.audioContent);
      console.log(`  Saved: ${outputPath}`);
    } else {
      console.error(`  No audio content received for ${exercise.id}`);
    }
  } catch (error) {
    console.error(`  Error generating audio for ${exercise.id}:`, error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("Google Cloud TTS Audio Generator");
  console.log("=================================\n");

  // Check for credentials
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set");
    console.error("Please set it to the path of your Google Cloud service account JSON key");
    process.exit(1);
  }

  // Initialize client
  const client = new TextToSpeechClient();

  // Define exercises to process (the 3 test dialogues)
  const exerciseIds = ["bij-de-bakker", "een-telefoongesprek", "bij-de-huisarts"];
  const exercisesDir = path.join(process.cwd(), "content", "luisteren", "exercises");
  const outputDir = path.join(process.cwd(), "public", "audio", "test", "google");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load and process exercises
  for (const id of exerciseIds) {
    const exercisePath = path.join(exercisesDir, `${id}.json`);

    if (!fs.existsSync(exercisePath)) {
      console.error(`Exercise file not found: ${exercisePath}`);
      continue;
    }

    const exerciseData = JSON.parse(fs.readFileSync(exercisePath, "utf-8")) as Exercise;
    await generateAudio(client, exerciseData, outputDir);
  }

  console.log("\nDone! Audio files generated in:", outputDir);
}

main().catch(console.error);
