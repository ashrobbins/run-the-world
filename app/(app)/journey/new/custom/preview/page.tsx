import Link from "next/link";
import { redirect } from "next/navigation";
import { readPendingRoute, createCustomJourney } from "@/lib/journeys/actions";
import { haversineDistanceKm } from "@/lib/geo";
import { targetCheckpointCount } from "@/lib/journeys/route-generator";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";

export default async function RoutePreviewPage() {
  const route = await readPendingRoute();
  if (!route || route.length < 2) redirect("/journey/new/custom");

  let totalDistanceKm = 0;
  for (let i = 1; i < route.length; i++) {
    totalDistanceKm += haversineDistanceKm(route[i - 1], route[i]);
  }
  const expectedCheckpoints = targetCheckpointCount(totalDistanceKm);
  const isRichRoute = route.length - 2 >= Math.round(expectedCheckpoints * 0.4);

  return (
    <div className="px-6 pt-5 pb-6 flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-1">
        <Link href="/journey/new/custom/options" aria-label="Back">
          <BackIcon />
        </Link>
        <div className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          {route[0].name} &rarr; {route[route.length - 1].name}
        </div>
        <span className="w-5" />
      </div>

      <div className="flex flex-row items-center gap-2.5 mt-4 overflow-x-auto pb-1">
        {route.map((point, i) => (
          <div key={`${point.name}-${i}`} className="shrink-0">
            <CheckpointMarker countryCode={point.countryCode} state="preview" label={point.name} size={38} />
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-3 mt-4">
        <div className="flex-1 rounded-2xl border p-3.5" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
            Total distance
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {Math.round(totalDistanceKm).toLocaleString()} km
          </div>
        </div>
        <div className="flex-1 rounded-2xl border p-3.5" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
            Checkpoints
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {route.length}
          </div>
        </div>
      </div>

      {!isRichRoute && (
        <div className="rounded-xl px-3.5 py-3 mt-3 text-xs" style={{ background: "var(--color-accent-light)", color: "var(--color-text-primary)" }}>
          We don&rsquo;t have many known cities directly along this route, so it&rsquo;s mostly a direct path — still fully playable, just fewer checkpoints along the way.
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="journey-name" className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          Name this journey (optional)
        </label>
        <input
          id="journey-name"
          name="name"
          type="text"
          placeholder={`${route[0].name} → ${route[route.length - 1].name}`}
          className="w-full rounded-xl border px-3.5 py-3 mt-1.5 text-sm"
          style={{ borderColor: "var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
          form="create-custom-journey-form"
        />
      </div>

      <div className="flex-1" />

      <form id="create-custom-journey-form" action={createCustomJourney} className="mt-4">
        <button
          type="submit"
          className="w-full rounded-xl py-3.5 text-sm font-bold text-white"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Start this journey
        </button>
      </form>
      <Link href="/journey/new/custom/options" className="text-center text-xs font-semibold mt-3" style={{ color: "var(--color-text-secondary)" }}>
        Choose a different route
      </Link>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
