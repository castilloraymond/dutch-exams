"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type PermissionStatus = "prompt" | "granted" | "denied" | "unsupported";

export interface UseAudioRecorderReturn {
  // State
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;

  // Controls
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;

  // Permission
  permissionStatus: PermissionStatus;
  requestPermission: () => Promise<boolean>;

  // Error
  error: string | null;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("prompt");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Check browser support
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus("unsupported");
        setError("Your browser does not support audio recording.");
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (permissionStatus === "unsupported") {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop the stream, we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus("granted");
      setError(null);
      return true;
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionStatus("denied");
      setError("Microphone access denied. Please enable it in your browser settings.");
      return false;
    }
  }, [permissionStatus]);

  const startRecording = useCallback(async () => {
    setError(null);

    // Check if we have permission
    if (permissionStatus === "unsupported") {
      setError("Your browser does not support audio recording.");
      return;
    }

    if (permissionStatus === "denied") {
      setError("Microphone access denied. Please enable it in your browser settings.");
      return;
    }

    try {
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;
      setPermissionStatus("granted");

      // Determine MIME type based on browser support
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "";
          }
        }
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        setAudioBlob(blob);

        // Revoke previous URL if exists
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.onerror = () => {
        setError("Recording error occurred. Please try again.");
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100);
    } catch (err) {
      console.error("Recording error:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setPermissionStatus("denied");
        setError("Microphone access denied. Please enable it in your browser settings.");
      } else {
        setError("Failed to start recording. Please check your microphone.");
      }
    }
  }, [permissionStatus, audioUrl]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const resetRecording = useCallback(() => {
    // Stop recording if in progress
    if (isRecording) {
      stopRecording();
    }

    // Revoke old URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Reset state
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setError(null);
    chunksRef.current = [];
  }, [isRecording, stopRecording, audioUrl]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    permissionStatus,
    requestPermission,
    error,
  };
}
