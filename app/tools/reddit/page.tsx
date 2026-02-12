"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  timestamp: number;
  postTitle: string;
  postText: string;
  subreddit: string;
  postType: string;
  response: string;
}

const POST_TYPES = [
  { value: "question", label: "Question" },
  { value: "frustration", label: "Rant / Frustration" },
  { value: "advice", label: "Seeking Advice" },
  { value: "success", label: "Success Story" },
  { value: "discussion", label: "Discussion" },
  { value: "resource", label: "Resource Sharing" },
];

const SUBREDDIT_PRESETS = [
  "Netherlands",
  "learndutch",
  "dutch",
  "expats",
  "IWantOut",
  "languagelearning",
  "duolingo",
];

const STORAGE_KEY = "reddit-engagement-history";

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
}

export default function RedditToolPage() {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [postType, setPostType] = useState("question");
  const [additionalContext, setAdditionalContext] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const generateResponse = useCallback(async () => {
    if (!postText.trim()) {
      setError("Paste the Reddit post first");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/reddit-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postText,
          postTitle: postTitle || undefined,
          subreddit: subreddit || undefined,
          postType,
          additionalContext: additionalContext || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate response");
        return;
      }

      setResponse(data.response);

      const entry: HistoryEntry = {
        id: Date.now().toString(36),
        timestamp: Date.now(),
        postTitle: postTitle || postText.slice(0, 60) + "...",
        postText,
        subreddit,
        postType,
        response: data.response,
      };
      const updated = [entry, ...history].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [postText, postTitle, subreddit, postType, additionalContext, history]);

  const regenerate = useCallback(async () => {
    await generateResponse();
  }, [generateResponse]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = response;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [response]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const deleteHistoryEntry = useCallback(
    (id: string) => {
      const updated = history.filter((e) => e.id !== id);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setPostTitle(entry.postTitle);
    setPostText(entry.postText);
    setSubreddit(entry.subreddit);
    setPostType(entry.postType);
    setResponse(entry.response);
    setShowHistory(false);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--cream-dark)] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-[var(--accent)]" />
            <h1 className="text-lg font-bold text-[var(--ink)]">
              Reddit Engagement Tool
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Input Section */}
        <section className="bg-white rounded-xl border border-[var(--cream-dark)] p-5 space-y-4 shadow-sm">
          <h2 className="font-semibold text-[var(--ink)]">Reddit Post</h2>

          {/* Subreddit + Post Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                Subreddit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] text-sm">
                  r/
                </span>
                <input
                  type="text"
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  placeholder="Netherlands"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--cream-dark)] rounded-lg bg-[var(--cream)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUBREDDIT_PRESETS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubreddit(sub)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      subreddit === sub
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "border-[var(--cream-dark)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                Post Type
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--cream-dark)] rounded-lg bg-[var(--cream)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
              >
                {POST_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
              Post Title
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Original post title..."
              className="w-full px-3 py-2 text-sm border border-[var(--cream-dark)] rounded-lg bg-[var(--cream)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
            />
          </div>

          {/* Post Text */}
          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
              Post Content
            </label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Paste the Reddit post here..."
              rows={8}
              className="w-full px-3 py-2 text-sm border border-[var(--cream-dark)] rounded-lg bg-[var(--cream)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-y"
            />
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
              Angle / Context{" "}
              <span className="text-[var(--ink-muted)] font-normal">
                (optional — steer the response)
              </span>
            </label>
            <input
              type="text"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder='e.g. "Focus on KNM prep tips" or "Be empathetic, they seem stressed"'
              className="w-full px-3 py-2 text-sm border border-[var(--cream-dark)] rounded-lg bg-[var(--cream)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateResponse}
            disabled={loading || !postText.trim()}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-glow)] text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Response"
            )}
          </Button>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </section>

        {/* Response Section */}
        {response && (
          <section className="bg-white rounded-xl border border-[var(--cream-dark)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--ink)]">
                Generated Response
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={regenerate}
                  disabled={loading}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  <RefreshCw
                    className={`size-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  {copied ? (
                    <>
                      <Check className="size-4 text-[var(--green)]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-[var(--ink)] font-sans leading-relaxed">
                {response}
              </pre>
            </div>

            <p className="text-xs text-[var(--ink-muted)]">
              Review and personalize before posting. Edit to match your voice.
            </p>
          </section>
        )}

        {/* History Section */}
        <section className="bg-white rounded-xl border border-[var(--cream-dark)] p-5 shadow-sm">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-semibold text-[var(--ink)]">
              Response History{" "}
              <span className="text-[var(--ink-muted)] font-normal text-sm">
                ({history.length})
              </span>
            </h2>
            {showHistory ? (
              <ChevronUp className="size-4 text-[var(--ink-muted)]" />
            ) : (
              <ChevronDown className="size-4 text-[var(--ink-muted)]" />
            )}
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-[var(--ink-muted)]">
                  No responses generated yet.
                </p>
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" />
                      Clear All
                    </Button>
                  </div>
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-[var(--cream-dark)] rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() =>
                            setExpandedHistoryId(
                              expandedHistoryId === entry.id
                                ? null
                                : entry.id
                            )
                          }
                          className="flex-1 text-left"
                        >
                          <p className="text-sm font-medium text-[var(--ink)] truncate">
                            {entry.postTitle}
                          </p>
                          <p className="text-xs text-[var(--ink-muted)]">
                            {entry.subreddit && `r/${entry.subreddit} · `}
                            {new Date(entry.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => loadFromHistory(entry)}
                            title="Load this response"
                            className="text-[var(--ink-muted)] hover:text-[var(--accent)]"
                          >
                            <RefreshCw className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => deleteHistoryEntry(entry.id)}
                            title="Delete"
                            className="text-[var(--ink-muted)] hover:text-red-500"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>

                      {expandedHistoryId === entry.id && (
                        <div className="mt-3 pt-3 border-t border-[var(--cream-dark)]">
                          <pre className="whitespace-pre-wrap text-xs text-[var(--ink-soft)] font-sans leading-relaxed">
                            {entry.response}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
