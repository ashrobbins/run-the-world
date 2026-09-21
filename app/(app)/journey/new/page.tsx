import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { startCuratedJourney } from "@/lib/journeys/actions";
import { RouteShapeArt } from "@/components/journey/RouteShapeArt";

// Cycled by index so cards don't all look identical — purely decorative.
const TILE_STYLES = [
  { background: "#FDE8DC", stroke: "#E87A4C" },
  { background: "#EDEBFB", stroke: "#6C5CE7" },
  { background: "#E1F3EE", stroke: "#1B8A4E" },
];

export default async function JourneyLibraryPage() {
  const supabase = await createClient();

  const { data: journeys } = await supabase
    .from("journeys")
    .select("id, name, description, total_distance")
    .eq("journey_type", "curated")
    .eq("is_published", true)
    .order("name");

  const journeyIds = (journeys ?? []).map((j) => j.id);
  const { data: checkpointRows } = journeyIds.length
    ? await supabase
        .from("checkpoints")
        .select("journey_id, lat, lng, sequence_number")
        .in("journey_id", journeyIds)
        .order("sequence_number", { ascending: true })
    : { data: [] as { journey_id: string; lat: number; lng: number; sequence_number: number }[] };

  const countByJourney = new Map<string, number>();
  const pointsByJourney = new Map<string, { lat: number; lng: number }[]>();
  for (const row of checkpointRows ?? []) {
    countByJourney.set(row.journey_id, (countByJourney.get(row.journey_id) ?? 0) + 1);
    const points = pointsByJourney.get(row.journey_id) ?? [];
    points.push({ lat: row.lat, lng: row.lng });
    pointsByJourney.set(row.journey_id, points);
  }

  return (
    <div className="px-6 pt-5 pb-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/home" aria-label="Back">
          <BackIcon />
        </Link>
        <h1 className="text-base font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          New Journey
        </h1>
        <span className="w-5" />
      </div>

      <Link
        href="/journey/new/custom"
        className="block rounded-2xl p-4 mb-6"
        style={{ background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)" }}
      >
        <div className="font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Plan your own route
        </div>
        <p className="text-xs mt-1 max-w-[240px]" style={{ color: "rgba(255,255,255,0.8)" }}>
          Pick any start and destination — we&rsquo;ll suggest routes and cities along the way.
        </p>
        <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 mt-3">
          <PlusIcon />
          <span className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
            Set start &amp; destination
          </span>
        </div>
      </Link>

      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
        Curated journeys
      </h2>

      <div className="flex flex-col gap-3">
        {(journeys ?? []).map((journey, index) => {
          const tileStyle = TILE_STYLES[index % TILE_STYLES.length];
          const points = pointsByJourney.get(journey.id) ?? [];
          return (
          <form key={journey.id} action={startCuratedJourney}>
            <input type="hidden" name="journeyId" value={journey.id} />
            <button
              type="submit"
              className="w-full text-left flex items-center gap-3 rounded-2xl p-3 border"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl shrink-0 overflow-hidden"
                style={{ background: tileStyle.background }}
              >
                {points.length >= 2 && (
                  <RouteShapeArt points={points} strokeColor={tileStyle.stroke} className="w-full h-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                  {journey.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  {journey.description}
                </div>
                <div className="text-[11px] font-bold mt-1" style={{ color: "var(--color-accent)" }}>
                  {journey.total_distance.toLocaleString()} km &middot; {countByJourney.get(journey.id) ?? 0} checkpoints
                </div>
              </div>
              <ChevronIcon />
            </button>
          </form>
          );
        })}
      </div>
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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
