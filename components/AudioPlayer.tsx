"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  text: string;
  lang?: string;
}

export function AudioPlayer({ text, lang = "nl-NL" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [text, lang, isSupported]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  }, []);

  const replay = useCallback(() => {
    window.speechSynthesis.cancel();
    speak();
  }, [speak]);

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted-foreground">
          Speech synthesis is not supported in your browser.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-center gap-3">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Luister naar het fragment</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          {!isPlaying ? (
            <Button onClick={speak} size="lg">
              <Play className="mr-2 h-5 w-5" />
              Afspelen
            </Button>
          ) : (
            <Button onClick={pause} variant="outline" size="lg">
              <Pause className="mr-2 h-5 w-5" />
              Pauze
            </Button>
          )}
          <Button onClick={replay} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Opnieuw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
