/**
 * Utility functions — ported for React Native.
 * No Tailwind/clsx dependencies in native.
 */

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Format seconds into mm:ss display.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage, clamped to 0-100.
 */
export function calculatePercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Check if an exam result is a pass (≥60%).
 */
export function isPassing(correct: number, total: number): boolean {
  if (total <= 0) return false;
  return (correct / total) >= 0.6;
}
