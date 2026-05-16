// ── FILE: src/utils/time.ts ──────────────────────────────
export function getTimeLeft(resetAt: number | null): {
  h: number;
  m: number;
  s: number;
  totalMs: number;
  pct: number;
} | null {
  if (!resetAt) return null;

  const now = Date.now();
  const diff = resetAt - now;

  if (diff <= 0) return null;

  const totalMs = diff;
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  const pct = (diff / (24 * 60 * 60 * 1000)) * 100;

  return { h, m, s, totalMs, pct };
}

export function formatTime(h: number, m: number, s: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function isPast(timestamp: number | null): boolean {
  if (!timestamp) return false;
  return timestamp < Date.now();
}
