import { formatDistance, type UnitPreference } from "@/lib/units";

export function LastRunCard({
  distanceKm,
  date,
  unit,
}: {
  distanceKm: number;
  date: string;
  unit: UnitPreference;
}) {
  const formattedDate = new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className="mt-3 rounded-2xl border p-3.5"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
          Last run added
        </span>
        <span
          className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#FDECE4", color: "#C24A16" }}
        >
          Synced from Strava
        </span>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div>
          <div className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {formatDistance(distanceKm, unit)}
          </div>
          <div className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
