/**
 * Google Cloud TTS audio generation for Spreken questions
 *
 * Generates MP3 files for all Spreken question prompts and person statements
 * using high-quality Google Cloud Dutch voices with male/female mix.
 *
 * Prerequisites:
 * 1. Enable Cloud Text-to-Speech API in Google Cloud Console
 * 2. Create service account, download JSON key
 * 3. Set GOOGLE_APPLICATION_CREDENTIALS in .env.local
 *
 * Usage: npm run generate-spreken-audio
 */

import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

// Chirp3-HD voices — Google's most natural Dutch voices
const VOICE_QUESTION = "nl-NL-Chirp3-HD-Leda";    // Female voice for examiner questions
const VOICE_PERSON = "nl-NL-Chirp3-HD-Charon";    // Male voice for person statements

interface AudioJob {
  id: string;
  text: string;
  voice: string;
  outputPath: string;
}

/**
 * Generate a single MP3 file using Google TTS
 */
async function generateAudio(
  client: TextToSpeechClient,
  job: AudioJob
): Promise<boolean> {
  if (fs.existsSync(job.outputPath)) {
    return true; // Already exists
  }

  // Chirp3-HD uses plain text (no SSML) for most natural results
  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: {
      text: job.text,
    },
    voice: {
      languageCode: "nl-NL",
      name: job.voice,
    },
    audioConfig: {
      audioEncoding: "MP3",
      sampleRateHertz: 24000,
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    if (response.audioContent) {
      fs.writeFileSync(job.outputPath, response.audioContent);
      console.log(`  Generated: ${path.basename(job.outputPath)}`);
      return true;
    }
    console.error(`  No audio content for ${job.id}`);
    return false;
  } catch (error) {
    console.error(`  Error for ${job.id}:`, error);
    return false;
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Collect all audio jobs from spreken content
 */
function collectJobs(outputDir: string): AudioJob[] {
  const jobs: AudioJob[] = [];
  const seen = new Set<string>();
  const contentBase = path.join(process.cwd(), "content");

  function addJob(id: string, text: string, voice: string) {
    if (seen.has(id)) return;
    seen.add(id);
    jobs.push({ id, text, voice, outputPath: path.join(outputDir, `${id}.mp3`) });
  }

  // --- Task files ---
  const taskDir = path.join(contentBase, "spreken", "tasks");
  for (const file of fs.readdirSync(taskDir).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(taskDir, file), "utf-8"));

    if (data.questionNl) addJob(`task-${data.id}-question`, data.questionNl, VOICE_QUESTION);
    if (data.personStatementNl) addJob(`task-${data.id}-person`, data.personStatementNl, VOICE_PERSON);

    if (data.questions) {
      for (const q of data.questions) {
        if (q.questionNl) addJob(`${q.id}-question`, q.questionNl, VOICE_QUESTION);
        if (q.personStatementNl) addJob(`${q.id}-person`, q.personStatementNl, VOICE_PERSON);
      }
    }
  }

  // --- Mock exam files ---
  const mockDir = path.join(contentBase, "mock-exams", "spreken");
  for (const file of fs.readdirSync(mockDir).filter((f) => f.endsWith(".json") && f !== "index.json")) {
    const data = JSON.parse(fs.readFileSync(path.join(mockDir, file), "utf-8"));

    if (data.questions) {
      for (const q of data.questions) {
        if (q.questionNl) addJob(`${q.id}-question`, q.questionNl, VOICE_QUESTION);
        if (q.personStatementNl) addJob(`${q.id}-person`, q.personStatementNl, VOICE_PERSON);
      }
    }
  }

  return jobs;
}

/**
 * Update JSON content files with audio file references
 */
function updateContentFiles(outputDir: string): void {
  const contentBase = path.join(process.cwd(), "content");
  const audioBase = "/audio/spreken/questions";

  function maybeSet(obj: Record<string, unknown>, field: string, id: string) {
    const mp3 = path.join(outputDir, `${id}.mp3`);
    if (fs.existsSync(mp3)) obj[field] = `${audioBase}/${id}.mp3`;
  }

  // --- Task files ---
  const taskDir = path.join(contentBase, "spreken", "tasks");
  for (const file of fs.readdirSync(taskDir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(taskDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    let changed = false;
    const before = JSON.stringify(data);

    maybeSet(data, "questionAudioFile", `task-${data.id}-question`);
    maybeSet(data, "personStatementAudioFile", `task-${data.id}-person`);

    if (data.questions) {
      for (const q of data.questions) {
        maybeSet(q, "questionAudioFile", `${q.id}-question`);
        maybeSet(q, "personStatementAudioFile", `${q.id}-person`);
      }
    }

    if (JSON.stringify(data) !== before) {
      changed = true;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
      console.log(`  Updated: ${file}`);
    }
  }

  // --- Mock exam files ---
  const mockDir = path.join(contentBase, "mock-exams", "spreken");
  for (const file of fs.readdirSync(mockDir).filter((f) => f.endsWith(".json") && f !== "index.json")) {
    const filePath = path.join(mockDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const before = JSON.stringify(data);

    if (data.questions) {
      for (const q of data.questions) {
        maybeSet(q, "questionAudioFile", `${q.id}-question`);
        maybeSet(q, "personStatementAudioFile", `${q.id}-person`);
      }
    }

    if (JSON.stringify(data) !== before) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
      console.log(`  Updated: ${file}`);
    }
  }
}

async function main(): Promise<void> {
  console.log("Spreken Audio Generator (Google Cloud TTS)");
  console.log("==========================================\n");

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Error: GOOGLE_APPLICATION_CREDENTIALS not set in .env.local");
    process.exit(1);
  }

  const client = new TextToSpeechClient();

  const outputDir = path.join(process.cwd(), "public", "audio", "spreken", "questions");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jobs = collectJobs(outputDir);
  const newJobs = jobs.filter((j) => !fs.existsSync(j.outputPath));
  console.log(`Found ${jobs.length} total, ${newJobs.length} new to generate\n`);

  let generated = 0;
  let failed = 0;

  for (const job of newJobs) {
    const success = await generateAudio(client, job);
    if (success) {
      generated++;
    } else {
      failed++;
      if (failed >= 3) {
        console.log("\nStopping after 3 failures");
        break;
      }
    }
  }

  console.log(`\n--- Generation complete ---`);
  console.log(`Generated: ${generated}, Skipped: ${jobs.length - newJobs.length}, Failed: ${failed}`);

  console.log("\nUpdating content files with audio references...");
  updateContentFiles(outputDir);

  console.log("\nDone!");
}

main().catch(console.error);
