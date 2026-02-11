"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, FastForward } from "lucide-react";

interface AudioPlayerProps {
  audioSrc?: string;
  /** Fallback: use Web Speech Synthesis if no audioSrc provided */
  fallbackText?: string;
}

// Parse dialogue text into segments with speaker info
interface DialogueSegment {
  speaker: string | null;
  text: string;
}

// Speaker voice configuration - maps speaker types to voice preferences
const SPEAKER_VOICE_MAP: Record<string, { gender: "male" | "female"; pitch: number }> = {
  // Customer/patient roles (typically requesting services)
  klant: { gender: "female", pitch: 1.1 },
  patiënt: { gender: "female", pitch: 1.1 },
  patient: { gender: "female", pitch: 1.1 },
  bezoeker: { gender: "female", pitch: 1.1 },
  student: { gender: "female", pitch: 1.15 },
  beller: { gender: "female", pitch: 1.1 },
  sollicitant: { gender: "female", pitch: 1.1 },

  // Service provider roles (typically male voices)
  bakker: { gender: "male", pitch: 0.9 },
  arts: { gender: "male", pitch: 0.85 },
  dokter: { gender: "male", pitch: 0.85 },
  medewerker: { gender: "male", pitch: 0.9 },
  ambtenaar: { gender: "male", pitch: 0.9 },
  receptionist: { gender: "female", pitch: 1.0 },
  collega: { gender: "male", pitch: 0.95 },
  baas: { gender: "male", pitch: 0.85 },
  manager: { gender: "male", pitch: 0.85 },
  leraar: { gender: "male", pitch: 0.9 },
  teacher: { gender: "male", pitch: 0.9 },
  docent: { gender: "male", pitch: 0.9 },
  chef: { gender: "male", pitch: 0.85 },
  werkgever: { gender: "male", pitch: 0.85 },
  apotheker: { gender: "male", pitch: 0.9 },

  // Named characters - female
  anna: { gender: "female", pitch: 1.1 },
  lisa: { gender: "female", pitch: 1.1 },
  karin: { gender: "female", pitch: 1.0 },
  secretaresse: { gender: "female", pitch: 1.0 },

  // Named characters - male
  jan: { gender: "male", pitch: 0.95 },
  erik: { gender: "male", pitch: 0.95 },
  mark: { gender: "male", pitch: 0.95 },
  peter: { gender: "male", pitch: 0.95 },
  jansen: { gender: "male", pitch: 0.9 },
  "meneer jansen": { gender: "male", pitch: 0.9 },
  mohammed: { gender: "male", pitch: 0.95 },
  buurman: { gender: "male", pitch: 0.95 },

  // Neutral/narrator
  verteller: { gender: "female", pitch: 1.0 },
  narrator: { gender: "female", pitch: 1.0 },
};

function parseDialogue(text: string): DialogueSegment[] {
  // Pattern to match "Speaker:" at the beginning or after punctuation/space
  const speakerPattern = /(?:^|(?<=[.!?]\s*))([A-Za-zÀ-ÿ]+):\s*/g;

  const segments: DialogueSegment[] = [];
  let lastIndex = 0;
  let currentSpeaker: string | null = null;

  // Find all speaker labels
  const matches = [...text.matchAll(speakerPattern)];

  if (matches.length === 0) {
    // No dialogue format detected, return as single segment
    return [{ speaker: null, text: text.trim() }];
  }

  for (const match of matches) {
    // Add any text before this speaker label (shouldn't happen in well-formed dialogue)
    if (match.index! > lastIndex && currentSpeaker !== null) {
      const segmentText = text.slice(lastIndex, match.index).trim();
      if (segmentText) {
        segments.push({ speaker: currentSpeaker, text: segmentText });
      }
    }

    currentSpeaker = match[1].toLowerCase();
    lastIndex = match.index! + match[0].length;
  }

  // Add the final segment
  if (lastIndex < text.length) {
    const segmentText = text.slice(lastIndex).trim();
    if (segmentText) {
      segments.push({ speaker: currentSpeaker, text: segmentText });
    }
  }

  return segments;
}

function getVoiceForSpeaker(
  speaker: string | null,
  voices: SpeechSynthesisVoice[],
  speakerIndex: number
): { voice: SpeechSynthesisVoice | null; pitch: number } {
  // Get Dutch voices
  const dutchVoices = voices.filter(v => v.lang.startsWith("nl"));

  if (dutchVoices.length === 0) {
    return { voice: null, pitch: 1.0 };
  }

  // Get voice config for speaker
  const config = speaker ? SPEAKER_VOICE_MAP[speaker] : null;
  const preferredGender = config?.gender || (speakerIndex % 2 === 0 ? "female" : "male");
  const pitch = config?.pitch || 1.0;

  // Try to find a voice matching the preferred gender
  // Note: Voice names often contain gender hints
  const genderVoice = dutchVoices.find(v => {
    const nameLower = v.name.toLowerCase();
    if (preferredGender === "female") {
      return nameLower.includes("female") || nameLower.includes("vrouw") ||
             nameLower.includes("ellen") || nameLower.includes("flo") ||
             nameLower.includes("sara") || nameLower.includes("anna");
    } else {
      return nameLower.includes("male") || nameLower.includes("man") ||
             nameLower.includes("xander") || nameLower.includes("ruben") ||
             nameLower.includes("maarten") || !nameLower.includes("female");
    }
  });

  return {
    voice: genderVoice || dutchVoices[speakerIndex % dutchVoices.length],
    pitch
  };
}

export function AudioPlayer({ audioSrc, fallbackText }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceQueueRef = useRef<number>(0);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup: stop audio/speech on unmount (e.g., when navigating to next question)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.speechSynthesis.cancel();
      utteranceQueueRef.current++;
    };
  }, []);

  // Use Web Speech Synthesis as fallback if no audioSrc
  const useFallback = !audioSrc && !!fallbackText;

  // For fallback mode, we don't need to wait for audio to load
  const isLoading = !useFallback && !!audioSrc && duration === 0;

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioSrc]);

  // Speak dialogue with multiple voices
  const speakDialogue = useCallback((text: string) => {
    window.speechSynthesis.cancel();

    const segments = parseDialogue(text);
    const queueId = ++utteranceQueueRef.current;

    // Track unique speakers for voice assignment
    const speakerOrder: string[] = [];
    segments.forEach(seg => {
      if (seg.speaker && !speakerOrder.includes(seg.speaker)) {
        speakerOrder.push(seg.speaker);
      }
    });

    let currentIndex = 0;

    const speakNext = () => {
      // Check if this queue is still active
      if (queueId !== utteranceQueueRef.current) return;

      if (currentIndex >= segments.length) {
        setIsPlaying(false);
        return;
      }

      const segment = segments[currentIndex];
      const speakerIndex = segment.speaker ? speakerOrder.indexOf(segment.speaker) : 0;
      const { voice, pitch } = getVoiceForSpeaker(segment.speaker, voices, speakerIndex);

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = "nl-NL";
      utterance.rate = 0.9; // Slightly faster than before for more natural sound
      utterance.pitch = pitch;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        currentIndex++;
        // Small pause between speakers
        if (currentIndex < segments.length && queueId === utteranceQueueRef.current) {
          setTimeout(speakNext, 300);
        } else if (queueId === utteranceQueueRef.current) {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        if (queueId === utteranceQueueRef.current) {
          setIsPlaying(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    speakNext();
  }, [voices]);

  const togglePlay = useCallback(() => {
    if (useFallback) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        utteranceQueueRef.current++;
        setIsPlaying(false);
      } else {
        speakDialogue(fallbackText!);
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, useFallback, fallbackText, speakDialogue]);

  const replay = useCallback(() => {
    if (useFallback) {
      speakDialogue(fallbackText!);
      return;
    }

    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  }, [useFallback, fallbackText, speakDialogue]);

  const skipForward = useCallback(() => {
    if (useFallback || !audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
  }, [useFallback, duration]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (useFallback || !audioRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    },
    [useFallback, duration]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

        <div className="flex items-center justify-center gap-3 mb-4">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Luister naar het fragment</span>
        </div>

        {/* Progress bar - only show for MP3 */}
        {!useFallback && (
          <div className="mb-4">
            <div
              className="h-2 bg-[var(--ink)]/10 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--ink)]/60 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={togglePlay}
            size="lg"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pauze
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Afspelen
              </>
            )}
          </Button>

          {!useFallback && (
            <Button onClick={skipForward} variant="outline" size="lg" disabled={isLoading}>
              <FastForward className="h-4 w-4" />
              <span className="ml-1 text-xs">+5s</span>
            </Button>
          )}

          <Button onClick={replay} variant="outline" size="lg" disabled={isLoading}>
            <RotateCcw className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Opnieuw</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
