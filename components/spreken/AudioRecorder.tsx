"use client";

import { Square } from "lucide-react";

interface AudioRecorderProps {
  isRecording: boolean;
  recordingTime: number;
  onStop: () => void;
  recommendedDuration: number;
}

export function AudioRecorder({
  isRecording,
  recordingTime,
  onStop,
  recommendedDuration,
}: AudioRecorderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = Math.min((recordingTime / recommendedDuration) * 100, 100);

  return (
    <div className="landing-card p-6 text-center">
      {/* Recording indicator */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Pulsing rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div
                className="absolute inset-[-8px] rounded-full bg-red-500/10 animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
            </>
          )}

          {/* Main circle */}
          <div
            className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
              isRecording ? "bg-red-500" : "bg-gray-300"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Status text */}
      <p className="text-lg font-medium text-[var(--ink)] mb-2">
        {isRecording ? "Opname loopt..." : "Opname gestopt"}
      </p>

      {/* Timer */}
      <div className="text-3xl font-mono font-bold text-[var(--ink)] mb-4">
        {formatTime(recordingTime)}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 ${
            progress >= 100 ? "bg-orange-500" : "bg-[var(--accent)]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[var(--ink)]/60 mb-6">
        Aanbevolen: {formatTime(recommendedDuration)}
      </p>

      {/* Stop button */}
      {isRecording && (
        <button
          onClick={onStop}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <Square className="h-4 w-4 fill-current" />
          Stop opname
        </button>
      )}
    </div>
  );
}
