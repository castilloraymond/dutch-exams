"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mic,
  Clock,
  Square,
  Check,
  Lock,
  Lightbulb,
  Eye,
  EyeOff,
  Volume2,
  FileText,
  AlertCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { getQuickAssessmentSpeakingTask, getQuickAssessmentModules } from "@/lib/content";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { AssessmentCriterion } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

type Stage = "prompt" | "recording" | "playback" | "self-assessment" | "results";

const STORAGE_KEY = "quick-assessment-spreken-result";

export default function SprekenTrialPage() {
  const router = useRouter();
  const { user, loading: authLoading, isConfigured } = useAuth();

  const task = useMemo(() => getQuickAssessmentSpeakingTask(), []);
  const moduleInfo = useMemo(
    () => getQuickAssessmentModules().find((m) => m.module === "spreken"),
    []
  );

  const [stage, setStage] = useState<Stage>("prompt");
  const [checkedCriteria, setCheckedCriteria] = useState<Set<string>>(new Set());
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const {
    isRecording,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    permissionStatus,
    requestPermission,
    error: recorderError,
  } = useAudioRecorder();

  // Check authentication and completed assessment
  useEffect(() => {
    if (authLoading) return;

    // Require login to access try pages
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // If user has a completed result, redirect to /learn
    const hasCompletedResult = localStorage.getItem(STORAGE_KEY);
    if (hasCompletedResult) {
      router.push("/learn/spreken");
      return;
    }
  }, [user, authLoading, router]);

  // Time warning effect
  useEffect(() => {
    if (
      isRecording &&
      task &&
      recordingTime >= task.softLimitWarning &&
      !showTimeWarning
    ) {
      setShowTimeWarning(true);
    }

    // Auto-stop at recommended duration + 10 seconds buffer
    if (isRecording && task && recordingTime >= task.recommendedDuration + 10) {
      stopRecording();
      setStage("playback");
    }
  }, [isRecording, recordingTime, task, showTimeWarning, stopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    setShowTimeWarning(false);
    await startRecording();
    setStage("recording");
  };

  const handleStopRecording = () => {
    stopRecording();
    setStage("playback");
  };

  const handleReRecord = () => {
    resetRecording();
    setShowTimeWarning(false);
    setStage("prompt");
  };

  const handleSubmit = () => {
    setStage("self-assessment");
  };

  const toggleCriterion = (id: string) => {
    const newChecked = new Set(checkedCriteria);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedCriteria(newChecked);
  };

  const handleSelfAssessmentComplete = () => {
    // Save result to localStorage
    const result = {
      module: "spreken",
      recordingTime,
      checkedCriteria: Array.from(checkedCriteria),
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setStage("results");
  };

  const playModelAnswer = () => {
    if (!task) return;

    if (isPlayingModel) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.speechSynthesis.cancel();
      setIsPlayingModel(false);
      return;
    }

    // Try audio file first
    if (task.modelAnswer.audioFile && audioRef.current) {
      audioRef.current.play();
      setIsPlayingModel(true);
    } else {
      // Fallback to TTS
      const utterance = new SpeechSynthesisUtterance(task.modelAnswer.transcriptNl);
      utterance.lang = "nl-NL";
      utterance.rate = 0.9;

      utterance.onend = () => setIsPlayingModel(false);
      utterance.onerror = () => setIsPlayingModel(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingModel(true);
    }
  };

  const allChecked = task ? checkedCriteria.size === task.selfAssessmentCriteria.length : false;
  const score = checkedCriteria.size;
  const total = task?.selfAssessmentCriteria.length || 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 60;
  const isUnlocked = !!user;

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="text-[var(--landing-navy)]">Task not found</div>
      </div>
    );
  }

  const progress = Math.min((recordingTime / task.recommendedDuration) * 100, 100);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      {/* Hidden audio element for model answer */}
      {task.modelAnswer.audioFile && (
        <audio
          ref={audioRef}
          src={task.modelAnswer.audioFile}
          onEnded={() => setIsPlayingModel(false)}
          onError={() => setIsPlayingModel(false)}
        />
      )}

      {/* Header */}
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/try"
                className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-[var(--landing-orange)]" />
                <div>
                  <span className="text-xs text-[var(--landing-navy)]/60">
                    Part {task.partNumber}
                  </span>
                  <h1 className="text-lg font-bold font-sans-landing text-[var(--landing-navy)]">
                    {moduleInfo?.name} Trial
                  </h1>
                </div>
              </div>
            </div>
            {(stage === "recording" || stage === "playback") && (
              <div
                className={`flex items-center gap-2 ${
                  showTimeWarning
                    ? "text-orange-500"
                    : "text-[var(--landing-navy)]/60"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Time warning banner */}
      {showTimeWarning && isRecording && (
        <div className="bg-orange-100 border-b border-orange-300 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-orange-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>
              {task.recommendedDuration - recordingTime} seconds left! Wrap up your answer.
            </span>
          </div>
        </div>
      )}

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Permission error */}
          {recorderError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{recorderError}</p>
              {permissionStatus === "denied" && (
                <p className="text-red-600 text-xs mt-2">
                  Go to your browser settings to allow microphone access.
                </p>
              )}
            </div>
          )}

          {/* Prompt Stage */}
          {stage === "prompt" && (
            <div className="space-y-6">
              {/* Images */}
              {task.images && task.images.length > 0 && (
                <div className="grid gap-3 grid-cols-1">
                  {task.images.map((image) => (
                    <div key={image.id} className="relative">
                      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-200 max-w-md mx-auto">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        {/* Fallback placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          {image.altNl}
                        </div>
                      </div>
                      {image.label && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-[var(--landing-navy)]">
                          {image.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Question */}
              <div>
                <h2 className="font-bold text-[var(--landing-navy)] mb-1">
                  {task.questionNl}
                </h2>
                <p className="text-sm text-[var(--landing-navy)]/60">
                  {task.questionEn}
                </p>
                {task.questionParts && (
                  <div className="mt-3 p-3 bg-[var(--landing-orange)]/10 rounded-lg">
                    <p className="text-xs font-medium text-[var(--landing-navy)]/70 mb-2">
                      Answer both parts:
                    </p>
                    <ul className="text-sm text-[var(--landing-navy)] space-y-1">
                      {task.questionParts.map((part, idx) => (
                        <li key={idx}>
                          {idx + 1}. {part}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Permission request or start button */}
              {permissionStatus === "prompt" ? (
                <button
                  onClick={requestPermission}
                  className="w-full bg-[var(--landing-navy)] hover:bg-[var(--landing-navy)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Allow Microphone
                </button>
              ) : permissionStatus === "unsupported" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700">
                    Your browser doesn&apos;t support audio recording. Try Chrome, Firefox, or Safari.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStartRecording}
                  disabled={permissionStatus === "denied"}
                  className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="h-5 w-5" />
                  Start Recording
                </button>
              )}
            </div>
          )}

          {/* Recording Stage */}
          {stage === "recording" && (
            <div className="space-y-6">
              {/* Compact prompt reminder */}
              <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
                <p className="text-sm text-[var(--landing-navy)]">{task.questionNl}</p>
              </div>

              {/* Recording indicator */}
              <div className="landing-card p-6 text-center">
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
                <p className="text-lg font-medium text-[var(--landing-navy)] mb-2">
                  {isRecording ? "Recording..." : "Recording stopped"}
                </p>

                {/* Timer */}
                <div className="text-3xl font-mono font-bold text-[var(--landing-navy)] mb-4">
                  {formatTime(recordingTime)}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progress >= 100 ? "bg-orange-500" : "bg-[var(--landing-orange)]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--landing-navy)]/60 mb-6">
                  Recommended: {formatTime(task.recommendedDuration)}
                </p>

                {/* Stop button */}
                {isRecording && (
                  <button
                    onClick={handleStopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <Square className="h-4 w-4 fill-current" />
                    Stop Recording
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Playback Stage */}
          {stage === "playback" && audioUrl && (
            <div className="space-y-6">
              {/* Compact prompt reminder */}
              <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
                <p className="text-sm text-[var(--landing-navy)]">{task.questionNl}</p>
              </div>

              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--landing-navy)] mb-4">
                  Your Recording
                </h3>
                <audio controls src={audioUrl} className="w-full mb-4" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReRecord}
                    className="flex-1 border-2 border-[var(--landing-navy)] text-[var(--landing-navy)] hover:bg-[var(--landing-navy)] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Self-Assessment Stage */}
          {stage === "self-assessment" && audioUrl && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--landing-navy)] mb-2">
                  Rate Your Recording
                </h2>
                <p className="text-[var(--landing-navy)]/60">
                  Listen to your recording and check off what you did.
                </p>
              </div>

              {/* Audio playback */}
              <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className="h-5 w-5 text-[var(--landing-orange)]" />
                  <span className="font-medium text-[var(--landing-navy)]">
                    Your recording
                  </span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[var(--landing-navy)]">Checklist</h3>
                  <span className="text-sm text-[var(--landing-navy)]/60">
                    {checkedCriteria.size}/{task.selfAssessmentCriteria.length} checked
                  </span>
                </div>

                {task.selfAssessmentCriteria.map((criterion: AssessmentCriterion) => (
                  <button
                    key={criterion.id}
                    onClick={() => toggleCriterion(criterion.id)}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left ${
                      checkedCriteria.has(criterion.id)
                        ? "border-green-500 bg-green-50"
                        : "border-[var(--landing-navy)]/20 bg-white hover:bg-[var(--landing-navy)]/5"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        checkedCriteria.has(criterion.id)
                          ? "border-green-500 bg-green-500"
                          : "border-[var(--landing-navy)]/30"
                      }`}
                    >
                      {checkedCriteria.has(criterion.id) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-[var(--landing-navy)]">{criterion.textEn}</span>
                  </button>
                ))}
              </div>

              {/* Continue button */}
              <button
                onClick={handleSelfAssessmentComplete}
                disabled={!allChecked}
                className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {allChecked
                  ? "See Results"
                  : `Check all ${task.selfAssessmentCriteria.length} items to continue`}
              </button>
            </div>
          )}

          {/* Results Stage */}
          {stage === "results" && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="landing-card p-6 text-center">
                <h2 className="text-sm font-medium text-[var(--landing-navy)]/50 uppercase tracking-wide mb-4">
                  Your Self-Assessment
                </h2>

                <div className="flex justify-center items-center gap-4 mb-4">
                  <div
                    className={`text-5xl font-bold ${
                      passed ? "text-green-500" : "text-[var(--landing-orange)]"
                    }`}
                  >
                    {score}/{total}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      passed
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {percentage}%
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[var(--landing-navy)]/60">
                  <Clock className="h-4 w-4" />
                  <span>Recording: {formatTime(recordingTime)}</span>
                </div>
              </div>

              {/* Conversion hook - AI Transcript teaser */}
              <div className="rounded-xl shadow-lg p-6 bg-gradient-to-r from-[var(--landing-navy)] to-[var(--landing-navy)]/90 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Want to see what we heard?
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      You rated yourself {score}/{total}. But how was your grammar really?
                      Pro members get their speech transcribed and analyzed.
                    </p>
                    <Link
                      href="/auth/signup?redirect=/try/spreken"
                      className="inline-block bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Sign up to unlock
                    </Link>
                  </div>
                </div>
              </div>

              {/* Your recording vs Model answer */}
              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--landing-navy)] mb-4">
                  Compare with Example
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* User's recording */}
                  <div className="p-4 rounded-lg bg-[var(--landing-navy)]/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="h-4 w-4 text-[var(--landing-navy)]/60" />
                      <span className="text-sm font-medium text-[var(--landing-navy)]/60">
                        Your recording
                      </span>
                    </div>
                    {audioUrl && <audio controls src={audioUrl} className="w-full" />}
                  </div>

                  {/* Model answer */}
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="h-4 w-4 text-green-700" />
                      <span className="text-sm font-medium text-green-700">
                        Example answer
                      </span>
                    </div>
                    <button
                      onClick={playModelAnswer}
                      className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                        isPlayingModel
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {isPlayingModel ? "Stop" : "Listen to example"}
                    </button>
                  </div>
                </div>

                {/* Transcript toggle */}
                <div className="mt-4 pt-4 border-t border-[var(--landing-navy)]/10">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center gap-2 text-[var(--landing-orange)] hover:text-[var(--landing-orange)]/80 transition-colors"
                  >
                    {showTranscript ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {showTranscript ? "Hide transcript" : "Show transcript"}
                    </span>
                  </button>

                  {showTranscript && (
                    <div className="mt-3 p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-green-700" />
                        <span className="text-sm font-medium text-green-700">
                          Example text
                        </span>
                      </div>
                      <p className="text-[var(--landing-navy)] mb-2">
                        {task.modelAnswer.transcriptNl}
                      </p>
                      <p className="text-sm text-[var(--landing-navy)]/60 italic">
                        {task.modelAnswer.transcript}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips section */}
              <div className="landing-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-[var(--landing-orange)]" />
                  <h3 className="font-bold text-[var(--landing-navy)]">Tips</h3>
                </div>
                <ul className="space-y-2">
                  {task.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-[var(--landing-navy)]"
                    >
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Section */}
              {isUnlocked ? (
                /* Logged in: Show next step */
                <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-orange)]/5 to-[var(--landing-orange)]/10">
                  <h3 className="font-semibold text-[var(--landing-navy)] mb-2">
                    Ready to practice more?
                  </h3>
                  <p className="text-sm text-[var(--landing-navy)]/60 mb-4">
                    Try more speaking tasks to prepare for the real exam.
                  </p>
                  <Link
                    href="/learn/spreken"
                    className="inline-flex items-center gap-2 cta-primary px-6 py-3 text-white rounded-lg font-semibold"
                  >
                    Practice More Speaking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                /* Not logged in: Show signup CTAs */
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-[var(--landing-navy)] mb-1">
                      Save your progress & get AI transcription
                    </h3>
                    <p className="text-sm text-[var(--landing-navy)]/60">
                      Create a free account to continue learning
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {isConfigured && (
                      <GoogleSignInButton
                        className="w-full justify-center py-3.5"
                        redirectTo="/try/spreken"
                      >
                        Sign up with Google
                      </GoogleSignInButton>
                    )}

                    <Link
                      href="/auth/signup?redirect=/try/spreken"
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--landing-navy)] text-white rounded-full font-medium hover:bg-[var(--landing-navy)]/90 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Sign up with Email
                    </Link>

                    <p className="text-center text-sm text-[var(--landing-navy)]/50">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login?redirect=/try/spreken"
                        className="text-[var(--landing-orange)] hover:underline"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
