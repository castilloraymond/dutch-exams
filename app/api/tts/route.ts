import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const AZURE_TTS_KEY = process.env.AZURE_TTS_KEY;
const AZURE_TTS_REGION = process.env.AZURE_TTS_REGION || "westeurope";

// Whitelist of allowed Azure Dutch voices to prevent SSML injection
const ALLOWED_VOICES = new Set([
  "nl-NL-ColetteNeural",
  "nl-NL-FennaNeural",
  "nl-NL-MaartenNeural",
  "nl-BE-ArnaudNeural",
  "nl-BE-DenaNeural",
]);

export async function POST(request: NextRequest) {
  if (!AZURE_TTS_KEY) {
    return NextResponse.json(
      { error: "TTS not configured" },
      { status: 503 }
    );
  }

  // Rate limit: 20 requests per minute per IP
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfterMs } = rateLimit(`tts:${ip}`, 20, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  try {
    const { text, voice } = await request.json();

    if (!text || typeof text !== "string" || text.length > 2000) {
      return NextResponse.json(
        { error: "Invalid text parameter" },
        { status: 400 }
      );
    }

    // Validate voice against whitelist to prevent SSML injection
    const selectedVoice = (voice && typeof voice === "string" && ALLOWED_VOICES.has(voice))
      ? voice
      : "nl-NL-ColetteNeural";

    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='nl-NL'>
  <voice name='${selectedVoice}'>
    <prosody rate='-10%'>${escapeXml(text)}</prosody>
  </voice>
</speak>`;

    const tokenUrl = `https://${AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_TTS_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      },
      body: ssml,
    });

    if (!response.ok) {
      console.error("Azure TTS error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "TTS synthesis failed" },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
