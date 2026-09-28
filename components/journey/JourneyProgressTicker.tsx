"use client";

import { useEffect, useRef, useState } from "react";
import { formatDistance, type UnitPreference } from "@/lib/units";

const STORAGE_PREFIX = "rtw_seen_distance_";
const ANIMATION_MS = 1400;

/** Compares the journey's current distance_completed against whatever value this
 * browser last saw for it (localStorage — purely a per-device UI nicety, nothing
 * server-side depends on it) and, if it grew, shows a short count-up modal. */
export function JourneyProgressTicker({
  userJourneyId,
  distanceCompleted,
  totalDistance,
  unit,
}: {
  userJourneyId: string;
  distanceCompleted: number;
  totalDistance: number;
  unit: UnitPreference;
}) {
  const [previous, setPrevious] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState(distanceCompleted);
  const [open, setOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const key = STORAGE_PREFIX + userJourneyId;
    let stored: number | null = null;
    try {
      const raw = localStorage.getItem(key);
      stored = raw !== null ? Number(raw) : null;
      localStorage.setItem(key, String(distanceCompleted));
    } catch {
      // Private browsing / blocked storage — just skip the ticker silently.
      return;
    }

    if (stored !== null && Number.isFinite(stored) && stored < distanceCompleted - 0.01) {
      const seenValue = stored;
      setTimeout(() => {
        setPrevious(seenValue);
        setDisplayValue(seenValue);
        setOpen(true);
      }, 0);
    }
    // Intentionally comparing only against the value seen when this page was last
    // opened, not reacting to every prop change within the same mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJourneyId]);

  useEffect(() => {
    if (!open || previous === null) return;
    const start = performance.now();
    const from = previous;
    const to = distanceCompleted;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / ANIMATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, previous, distanceCompleted]);

  if (!open || previous === null) return null;

  const percent = Math.min(100, (displayValue / totalDistance) * 100);
  const delta = distanceCompleted - previous;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(18, 32, 61, 0.35)", backdropFilter: "blur(2px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center"
        style={{ background: "var(--color-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
          Progress updated
        </div>
        <div className="text-4xl font-extrabold mt-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          {formatDistance(displayValue, unit)}
        </div>
        <div className="text-xs font-semibold mt-1" style={{ color: "var(--color-text-secondary)" }}>
          / {formatDistance(totalDistance, unit)} &middot; +{formatDistance(delta, unit)}
        </div>

        <div className="h-2.5 rounded-full mt-4" style={{ background: "var(--color-progress-light)" }}>
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${Math.max(percent, 1)}%`, background: "var(--color-progress)" }}
          />
        </div>

        <button
          onClick={() => setOpen(false)}
          className="w-full rounded-xl py-3 text-sm font-bold text-white mt-5"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Keep going
        </button>
      </div>
    </div>
  );
}
