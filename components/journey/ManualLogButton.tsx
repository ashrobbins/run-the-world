"use client";

import { useState } from "react";
import { logManualActivity } from "@/lib/journeys/actions";
import type { UnitPreference } from "@/lib/units";

export function ManualLogButton({ userJourneyId, unit }: { userJourneyId: string; unit: UnitPreference }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  if (!open) {
    return (
      <p className="text-center text-xs mt-3" style={{ color: "var(--color-text-faint)" }}>
        Strava sync missed a run?{" "}
        <button onClick={() => setOpen(true)} className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          Log it manually
        </button>
      </p>
    );
  }

  return (
    <form action={logManualActivity} className="rounded-2xl border p-3.5 mt-3" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
      <input type="hidden" name="userJourneyId" value={userJourneyId} />
      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-secondary)" }}>
        Log a run manually
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
            Distance ({unit})
          </label>
          <input
            name="distance"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="block w-full mt-1 rounded-lg border px-2.5 py-2 text-sm"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
            Date
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={today}
            max={today}
            className="block w-full mt-1 rounded-lg border px-2.5 py-2 text-sm"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-primary)" }}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg py-2 text-sm font-semibold"
          style={{ background: "var(--color-bg)", color: "var(--color-text-secondary)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg py-2 text-sm font-bold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          Add run
        </button>
      </div>
    </form>
  );
}
