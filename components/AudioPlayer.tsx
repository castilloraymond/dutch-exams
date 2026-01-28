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

export function AudioPlayer({ audioSrc, fallbackText }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const togglePlay = useCallback(() => {
    if (useFallback) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fallbackText);
        utterance.lang = "nl-NL";
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
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
  }, [isPlaying, useFallback, fallbackText]);

  const replay = useCallback(() => {
    if (useFallback) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fallbackText);
      utterance.lang = "nl-NL";
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
      return;
    }

    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  }, [useFallback, fallbackText]);

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
              className="h-2 bg-[var(--landing-navy)]/10 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-[var(--landing-orange)] rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--landing-navy)]/60 mt-1">
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
