import { formatDistance, type UnitPreference } from "@/lib/units";

export function ProgressStat({
  distanceCompleted,
  totalDistance,
  unit,
}: {
  distanceCompleted: number;
  totalDistance: number;
  unit: UnitPreference;
}) {
  const percent = Math.min((distanceCompleted / totalDistance) * 100, 100);

  return (
    <div className="pt-3">
      <div className="flex items-baseline gap-2.5">
        <span
          className="text-[44px] leading-none font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          {formatDistance(distanceCompleted, unit).split(" ")[0]}
        </span>
        <span className="text-lg font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {unit}
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          / {formatDistance(totalDistance, unit)}
        </span>
      </div>
      <div className="h-1.5 rounded mt-3" style={{ background: "var(--color-accent-light)" }}>
        <div
          className="h-1.5 rounded"
          style={{ width: `${Math.max(percent, 1)}%`, background: "var(--color-accent)" }}
        />
      </div>
      <div
        className="text-xs font-semibold mt-1.5 uppercase tracking-wide"
        style={{ color: "var(--color-accent)" }}
      >
        {percent.toFixed(1)}% complete
      </div>
    </div>
  );
}
