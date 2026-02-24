/**
 * Azure Speech Services audio generation script
 *
 * Generates MP3 files for Luisteren exercises and mock exams using Azure TTS.
 * Uses different voices for different speakers to create natural dialogues.
 *
 * Prerequisites:
 * 1. Create Azure account with Speech Services (F0 tier is free)
 * 2. Get API key and region from Azure portal
 * 3. Set AZURE_TTS_KEY and AZURE_TTS_REGION env vars
 *
 * Usage: npm run generate-audio:azure
 */

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// Voice mapping for speakers
// Dutch Neural voices available in Azure
// Using mix of voices for realistic exam simulation
const VOICE_MAP: Record<string, string> = {
  // Female voices - Fenna (younger/casual), Colette (professional/mature)
  klant: "nl-NL-FennaNeural",
  patiënt: "nl-NL-FennaNeural",
  patient: "nl-NL-FennaNeural",
  assistente: "nl-NL-ColetteNeural",
  persoon: "nl-NL-FennaNeural",
  bezoeker: "nl-NL-FennaNeural",
  passagier: "nl-NL-FennaNeural",
  burger: "nl-NL-FennaNeural",
  sollicitant: "nl-NL-FennaNeural",
  anna: "nl-NL-FennaNeural",
  lisa: "nl-NL-FennaNeural",
  karin: "nl-NL-ColetteNeural",
  beller: "nl-NL-FennaNeural",
  reiziger: "nl-NL-FennaNeural",
  secretaresse: "nl-NL-ColetteNeural",
  buurvrouw: "nl-NL-ColetteNeural",
  moeder: "nl-NL-FennaNeural",
  lerares: "nl-NL-ColetteNeural",
  doktersassistente: "nl-NL-ColetteNeural",
  receptionist: "nl-NL-ColetteNeural", // Professional female role
  fatima: "nl-NL-FennaNeural",
  maria: "nl-NL-ColetteNeural",
  sanne: "nl-NL-FennaNeural",
  sara: "nl-NL-FennaNeural",
  sarah: "nl-NL-FennaNeural",
  "mevrouw aydin": "nl-NL-FennaNeural",
  "mevrouw bakker": "nl-NL-ColetteNeural",
  "mevrouw osman": "nl-NL-FennaNeural",
  "mevrouw hendriks": "nl-NL-ColetteNeural",
  "mevrouw kaya": "nl-NL-FennaNeural",
  "mevrouw jansen": "nl-NL-ColetteNeural",
  sandra: "nl-NL-FennaNeural",
  receptie: "nl-NL-ColetteNeural",
  "juf marieke": "nl-NL-ColetteNeural",
  "juf van dam": "nl-NL-ColetteNeural",
  huurder: "nl-NL-FennaNeural",
  bibliothecaris: "nl-NL-ColetteNeural",
  "ingesproken bericht": "nl-NL-ColetteNeural",

  // Male voices - Maarten
  bakker: "nl-NL-MaartenNeural",
  dokter: "nl-NL-MaartenNeural",
  medewerker: "nl-NL-MaartenNeural",
  chef: "nl-NL-MaartenNeural",
  ahmed: "nl-NL-MaartenNeural",
  verkoper: "nl-NL-MaartenNeural",
  ober: "nl-NL-MaartenNeural",
  buschauffeur: "nl-NL-MaartenNeural",
  loketmedewerker: "nl-NL-MaartenNeural",
  werkgever: "nl-NL-MaartenNeural",
  peter: "nl-NL-MaartenNeural",
  mark: "nl-NL-MaartenNeural",
  apotheker: "nl-NL-MaartenNeural",
  buurman: "nl-NL-MaartenNeural",
  vader: "nl-NL-MaartenNeural",
  leidinggevende: "nl-NL-MaartenNeural",
  // Named male characters
  jan: "nl-NL-MaartenNeural",
  erik: "nl-NL-MaartenNeural",
  jansen: "nl-NL-MaartenNeural",
  "meneer jansen": "nl-NL-MaartenNeural",
  mohammed: "nl-NL-MaartenNeural",
  werknemer: "nl-NL-MaartenNeural",
  kapper: "nl-NL-MaartenNeural",
  slager: "nl-NL-MaartenNeural",
  dierenarts: "nl-NL-MaartenNeural",
  makelaar: "nl-NL-MaartenNeural",
  notaris: "nl-NL-MaartenNeural",
  tandarts: "nl-NL-MaartenNeural",
  therapeut: "nl-NL-MaartenNeural",
  adviseur: "nl-NL-MaartenNeural",
  manager: "nl-NL-MaartenNeural",
  omroeper: "nl-NL-MaartenNeural",
  eigenaar: "nl-NL-MaartenNeural",
  verhuurder: "nl-NL-MaartenNeural",
  tom: "nl-NL-MaartenNeural",
  "meneer bakker": "nl-NL-MaartenNeural",
  "meneer hassan": "nl-NL-MaartenNeural",
  "meneer de jong": "nl-NL-MaartenNeural",
  "meneer yilmaz": "nl-NL-MaartenNeural",
  "meneer van dijk": "nl-NL-MaartenNeural",
  "meneer petrov": "nl-NL-MaartenNeural",
  "meneer de boer": "nl-NL-MaartenNeural",
  "medewerker ns": "nl-NL-MaartenNeural",
  kind: "nl-NL-FennaNeural",
  kinderen: "nl-NL-FennaNeural",
  // B1 exam speakers
  directeur: "nl-NL-MaartenNeural",
  hr: "nl-NL-ColetteNeural",
  nieuwslezer: "nl-NL-MaartenNeural",
  specialist: "nl-NL-MaartenNeural",
  voorzitter: "nl-NL-MaartenNeural",
  bewoner: "nl-NL-MaartenNeural",
  interviewer: "nl-NL-ColetteNeural",
  deelnemer: "nl-NL-FennaNeural",
  duo_medewerker: "nl-NL-MaartenNeural",
  docent: "nl-NL-ColetteNeural",
  ouder: "nl-NL-FennaNeural",
  presentator: "nl-NL-MaartenNeural",
  gast1: "nl-NL-MaartenNeural",
  gast2: "nl-NL-ColetteNeural",
};

// Pitch variations for male voice variety (only one male voice available)
const PITCH_MAP: Record<string, string> = {
  // Authority figures - deeper pitch
  dokter: "-5%",
  chef: "-5%",
  werkgever: "-5%",
  leidinggevende: "-3%",
  apotheker: "-3%",
  notaris: "-5%",
  manager: "-3%",
  tandarts: "-3%",

  // Service staff - neutral
  medewerker: "0%",
  verkoper: "0%",
  ober: "0%",
  loketmedewerker: "0%",
  kapper: "0%",
  slager: "0%",
  makelaar: "0%",
  dierenarts: "0%",
  therapeut: "0%",
  adviseur: "0%",
  verhuurder: "0%",
  omroeper: "0%",
  "medewerker ns": "0%",

  // B1 speakers
  directeur: "-5%",
  specialist: "-5%",
  nieuwslezer: "-3%",
  voorzitter: "-3%",
  bewoner: "+2%",
  presentator: "0%",
  gast1: "+2%",

  // Named male speakers from mock exams
  "meneer de jong": "+3%",
  "meneer yilmaz": "+2%",
  "meneer van dijk": "0%",
  "meneer petrov": "+2%",
  "meneer de boer": "+3%",

  // Casual/younger - slightly higher
  buurman: "+3%",
  peter: "+2%",
  mark: "+2%",
  jan: "+2%",
  erik: "+2%",
  mohammed: "+2%",
  tom: "+2%",
  eigenaar: "+2%",
};

// Default voices for unknown speakers
const DEFAULT_FEMALE = "nl-NL-FennaNeural";
const DEFAULT_MALE = "nl-NL-MaartenNeural";

interface DialogueSegment {
  speaker: string;
  text: string;
}

interface Exercise {
  id: string;
  title: string;
  transcript: string;
}

interface Transcript {
  id: string;
  title: string;
  transcript: string;
}

interface MockExam {
  id: string;
  title: string;
  transcripts: Transcript[];
}

/**
 * Parse dialogue transcript into segments with speaker info
 */
function parseDialogue(transcript: string): DialogueSegment[] {
  const segments: DialogueSegment[] = [];

  // Split by speaker pattern: "Speaker: text" - handle newlines too
  const speakerPattern = /(?:^|\n)([A-Za-zÀ-ÿ\s]+\d*):\s*/g;

  let lastIndex = 0;
  let currentSpeaker = "";
  const matches = [...transcript.matchAll(speakerPattern)];

  // If no dialogue format, treat as single narration segment
  if (matches.length === 0) {
    return [{ speaker: "narrator", text: transcript.trim() }];
  }

  for (const match of matches) {
    if (match.index! > lastIndex && currentSpeaker) {
      const text = transcript.slice(lastIndex, match.index).trim();
      if (text) {
        segments.push({ speaker: currentSpeaker, text });
      }
    }
    currentSpeaker = match[1].trim().toLowerCase();
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
 * Get voice name for a speaker
 */
function getVoice(speaker: string, speakerIndex: number): string {
  const lowerSpeaker = speaker.toLowerCase().trim();
  if (VOICE_MAP[lowerSpeaker]) {
    return VOICE_MAP[lowerSpeaker];
  }
  // Check for partial matches (e.g., "medewerker 1" -> medewerker)
  for (const [key, voice] of Object.entries(VOICE_MAP)) {
    if (lowerSpeaker.includes(key)) {
      return voice;
    }
  }
  // Alternate between male and female for unknown speakers
  return speakerIndex % 2 === 0 ? DEFAULT_FEMALE : DEFAULT_MALE;
}

/**
 * Get pitch adjustment for a speaker (for male voice variety)
 */
function getPitch(speaker: string): string {
  const lowerSpeaker = speaker.toLowerCase().trim();
  if (PITCH_MAP[lowerSpeaker]) {
    return PITCH_MAP[lowerSpeaker];
  }
  // Check for partial matches
  for (const [key, pitch] of Object.entries(PITCH_MAP)) {
    if (lowerSpeaker.includes(key)) {
      return pitch;
    }
  }
  return "0%";
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

  let ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="nl-NL">';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const speakerIndex = speakerOrder.indexOf(segment.speaker);
    const voice = getVoice(segment.speaker, speakerIndex);
    const pitch = getPitch(segment.speaker);

    // Escape special XML characters
    const escapedText = segment.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    ssml += `<voice name="${voice}">`;
    ssml += `<prosody rate="0.95" pitch="${pitch}">${escapedText}</prosody>`;
    // Add pause after each segment (except the last one) - break must be inside voice
    if (i < segments.length - 1) {
      ssml += '<break time="400ms"/>';
    }
    ssml += "</voice>";
  }

  ssml += "</speak>";
  return ssml;
}

/**
 * Generate audio for a single transcript using Azure
 */
async function generateAudio(
  speechConfig: sdk.SpeechConfig,
  id: string,
  title: string,
  transcript: string,
  outputPath: string
): Promise<boolean> {
  console.log(`  Generating: ${title} (${id})`);

  const segments = parseDialogue(transcript);
  console.log(`    Found ${segments.length} dialogue segments`);

  const ssml = buildSSML(segments);

  return new Promise((resolve) => {
    // Configure audio output to file
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakSsmlAsync(
      ssml,
      result => {
        synthesizer.close();

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(`    Saved: ${path.basename(outputPath)}`);
          resolve(true);
        } else if (result.reason === sdk.ResultReason.Canceled) {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.error(`    Synthesis canceled: ${cancellation.reason}`);
          if (cancellation.reason === sdk.CancellationReason.Error) {
            console.error(`    Error details: ${cancellation.errorDetails}`);
          }
          resolve(false);
        } else {
          console.error(`    Unexpected result: ${result.reason}`);
          resolve(false);
        }
      },
      error => {
        synthesizer.close();
        console.error(`    Error: ${error}`);
        resolve(false);
      }
    );
  });
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("Azure Speech Services Audio Generator");
  console.log("=====================================\n");

  // Check for credentials
  const subscriptionKey = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION || "westeurope";

  if (!subscriptionKey) {
    console.error("Error: AZURE_SPEECH_KEY environment variable not set");
    console.error("Please create an Azure Speech Services resource and set the API key");
    process.exit(1);
  }

  // Initialize speech config
  const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
  speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  const generatedFiles: string[] = [];
  let failedCount = 0;

  // ===== PART 1: Process Luisteren Exercises =====
  console.log("PART 1: Luisteren Exercises");
  console.log("---------------------------");

  const exerciseIds = [
    "bij-de-bakker",
    "een-telefoongesprek",
    "bij-de-huisarts",
    "op-het-gemeentehuis",
    "op-het-werk",
  ];
  const exercisesDir = path.join(process.cwd(), "content", "luisteren", "exercises");
  const exerciseOutputDir = path.join(process.cwd(), "public", "audio", "luisteren");

  // Ensure output directory exists
  if (!fs.existsSync(exerciseOutputDir)) {
    fs.mkdirSync(exerciseOutputDir, { recursive: true });
  }

  for (const id of exerciseIds) {
    const exercisePath = path.join(exercisesDir, `${id}.json`);

    if (!fs.existsSync(exercisePath)) {
      console.error(`Exercise file not found: ${exercisePath}`);
      continue;
    }

    const exercise = JSON.parse(fs.readFileSync(exercisePath, "utf-8")) as Exercise;
    const outputPath = path.join(exerciseOutputDir, `${id}.mp3`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping ${id} (already exists)`);
      generatedFiles.push(`/audio/luisteren/${id}.mp3`);
      continue;
    }

    const success = await generateAudio(speechConfig, id, exercise.title, exercise.transcript, outputPath);
    if (success) {
      generatedFiles.push(`/audio/luisteren/${id}.mp3`);
    } else {
      failedCount++;
      console.log("  Stopping due to error (likely quota exceeded)");
      break;
    }
  }

  if (failedCount > 0) {
    console.log("\n⚠️  Stopped early due to errors. You may have hit the free tier limit.");
    console.log(`Generated ${generatedFiles.length} files before stopping.\n`);
    console.log("Generated files:");
    generatedFiles.forEach(f => console.log(`  - ${f}`));
    return;
  }

  // ===== PART 2: Process Mock Exam Transcripts =====
  console.log("\nPART 2: Mock Exam Transcripts");
  console.log("-----------------------------");

  const mockExamIds = [
    "a1-exam-1", "a1-exam-2", "a1-exam-3", "a1-exam-4",
    "a2-exam-1", "a2-exam-2", "a2-exam-3", "a2-exam-4",
    "a2-exam-5", "a2-exam-6", "a2-exam-7", "a2-exam-8",
    "a2-exam-9", "a2-exam-10",
    "b1-exam-1", "b1-exam-2",
  ];
  const mockExamsDir = path.join(process.cwd(), "content", "mock-exams", "luisteren");
  const mockOutputDir = path.join(process.cwd(), "public", "audio", "luisteren", "mock");

  // Ensure output directory exists
  if (!fs.existsSync(mockOutputDir)) {
    fs.mkdirSync(mockOutputDir, { recursive: true });
  }

  for (const examId of mockExamIds) {
    const examPath = path.join(mockExamsDir, `${examId}.json`);

    if (!fs.existsSync(examPath)) {
      console.error(`Mock exam file not found: ${examPath}`);
      continue;
    }

    const exam = JSON.parse(fs.readFileSync(examPath, "utf-8")) as MockExam;
    console.log(`\nProcessing: ${exam.title}`);

    const updatedTranscripts: Transcript[] = [];

    for (const transcript of exam.transcripts) {
      const audioFileName = `${transcript.id}.mp3`;
      const outputPath = path.join(mockOutputDir, audioFileName);
      const audioFilePath = `/audio/luisteren/mock/${audioFileName}`;

      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`  Skipping ${transcript.id} (already exists)`);
        updatedTranscripts.push({ ...transcript, audioFile: audioFilePath } as Transcript & { audioFile: string });
        generatedFiles.push(audioFilePath);
        continue;
      }

      const success = await generateAudio(
        speechConfig,
        transcript.id,
        transcript.title,
        transcript.transcript,
        outputPath
      );

      if (success) {
        updatedTranscripts.push({ ...transcript, audioFile: audioFilePath } as Transcript & { audioFile: string });
        generatedFiles.push(audioFilePath);
      } else {
        failedCount++;
        updatedTranscripts.push(transcript); // Keep original without audioFile
        console.log("  Stopping due to error (likely quota exceeded)");
        break;
      }
    }

    // Update the JSON file with audioFile references
    const updatedExam = { ...exam, transcripts: updatedTranscripts };
    fs.writeFileSync(examPath, JSON.stringify(updatedExam, null, 2) + "\n");
    console.log(`  Updated: ${examId}.json`);

    if (failedCount > 0) {
      break;
    }
  }

  // ===== Summary =====
  console.log("\n=====================================");
  console.log("SUMMARY");
  console.log("=====================================");
  console.log(`Total files generated: ${generatedFiles.length}`);
  if (failedCount > 0) {
    console.log(`Failed: ${failedCount} (likely hit free tier quota)`);
  }
  console.log("\nGenerated audio files:");
  generatedFiles.forEach(f => console.log(`  - ${f}`));
}

main().catch(console.error);
