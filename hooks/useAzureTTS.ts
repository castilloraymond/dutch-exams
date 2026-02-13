"use client";

import { useState, useRef, useCallback } from "react";

export function useAzureTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  const speak = useCallback(
    async (text: string, voice?: string) => {
      // If already playing, stop
      if (isPlaying) {
        stop();
        return;
      }

      setIsPlaying(true);

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice }),
        });

        if (!response.ok) {
          throw new Error(`TTS API error: ${response.status}`);
        }

        const blob = await response.blob();

        // Clean up previous blob URL
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);

        await audio.play();
      } catch {
        // Fallback to Web Speech API
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "nl-NL";
          utterance.rate = 0.9;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        } catch {
          setIsPlaying(false);
        }
      }
    },
    [isPlaying, stop]
  );

  return { speak, stop, isPlaying };
}
