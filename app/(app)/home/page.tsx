import Link from "next/link";
import { startOfWeek } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { LinkWithStravaCta } from "@/components/strava/LinkWithStravaCta";
import { formatDistance, type UnitPreference } from "@/lib/units";
import { classifyCheckpoints, type CheckpointState } from "@/lib/journeys/progress";

// Seeded for brand-new connected users only — see supabase/seed.sql.
const SEEDED_JOURNEY_ID = "00000000-0000-0000-0000-000000000001";

interface JourneyCardData {
  userJourneyId: string;
  name: string;
  routeLabel: string | null;
  distanceCompleted: number;
  totalDistance: number;
  nextCheckpoint: { name: string; distance_from_start: number } | undefined;
  reachedCount: number;
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // middleware already redirects; this satisfies TS

  const { data: connection } = await supabase
    .from("strava_connections")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!connection) {
    return (
      <div className="px-6 pt-10 pb-6 flex flex-col items-center text-center">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Welcome to
          <br />
          Run the World
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          Connect Strava so your runs can start moving you along a route.
        </p>
        <LinkWithStravaCta />
      </div>
    );
  }

  let { data: userJourneys } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journeys(id, name, total_distance, start_name, destination_name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: true });

  // First-time connected user with no journeys at all: give them the seeded one so
  // Home isn't empty. Anyone who already has a journey (seeded, curated, or custom)
  // is left alone — we don't keep force-creating this.
  if (!userJourneys || userJourneys.length === 0) {
    const { data: created } = await supabase
      .from("user_journeys")
      .insert({ user_id: user.id, journey_id: SEEDED_JOURNEY_ID })
      .select("id, distance_completed, journeys(id, name, total_distance, start_name, destination_name)")
      .single();
    userJourneys = created ? [created] : [];
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();
  const unit: UnitPreference = profile?.unit_preference ?? "km";

  const journeyIds = userJourneys
    .map((uj) => (Array.isArray(uj.journeys) ? uj.journeys[0]?.id : uj.journeys?.id))
    .filter((id): id is string => Boolean(id));

  const { data: allCheckpoints } = journeyIds.length
    ? await supabase
        .from("checkpoints")
        .select("id, journey_id, name, distance_from_start")
        .in("journey_id", journeyIds)
    : { data: [] as Array<{ id: string; journey_id: string; name: string; distance_from_start: number }> };

  const checkpointsByJourney = new Map<string, typeof allCheckpoints>();
  for (const cp of allCheckpoints ?? []) {
    const list = checkpointsByJourney.get(cp.journey_id) ?? [];
    list.push(cp);
    checkpointsByJourney.set(cp.journey_id, list);
  }

  const cards: JourneyCardData[] = userJourneys.map((uj) => {
    const journey = Array.isArray(uj.journeys) ? uj.journeys[0] : uj.journeys;
    const checkpoints = checkpointsByJourney.get(journey.id) ?? [];
    const classified: Array<{ name: string; distance_from_start: number; state: CheckpointState }> =
      classifyCheckpoints(checkpoints, uj.distance_completed);
    const routeLabel = `${journey.start_name} → ${journey.destination_name}`;
    return {
      userJourneyId: uj.id,
      name: journey.name,
      routeLabel: journey.name === routeLabel ? null : routeLabel,
      distanceCompleted: uj.distance_completed,
      totalDistance: journey.total_distance,
      nextCheckpoint: classified.find((c) => c.state === "next"),
      reachedCount: classified.filter((c) => c.state === "reached").length,
    };
  });

  const totalDistanceAllJourneys = cards.reduce((sum, c) => sum + c.distanceCompleted, 0);
  const totalStampsCollected = cards.reduce((sum, c) => sum + c.reachedCount, 0);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
  const { data: thisWeekActivities } = await supabase
    .from("activities")
    .select("distance")
    .eq("user_id", user.id)
    .gte("activity_date", weekStart);
  const distanceThisWeek = (thisWeekActivities ?? []).reduce((sum, a) => sum + a.distance, 0);

  return (
    <div>
      {/* Hero */}
      <div
        className="rounded-b-3xl px-6 pt-6 pb-7"
        style={{ background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)" }}
      >
        <div>
          <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Welcome back
          </div>
          <p className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            You&rsquo;ve run {formatDistance(totalDistanceAllJourneys, unit)} across {cards.length} journey
            {cards.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-5 mt-4">
          <HeroStat value={cards.length} label="Active journeys" />
          <HeroStat value={totalStampsCollected} label="Stamps collected" />
          <HeroStat value={formatDistance(distanceThisWeek, unit)} label="this week" />
        </div>
      </div>

      {/* Journeys */}
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Your journeys
        </h1>

        <div className="flex flex-col gap-3 mt-3">
          {cards.map((card) => {
            const percent = ((card.distanceCompleted / card.totalDistance) * 100).toFixed(1);
            return (
              <Link
                key={card.userJourneyId}
                href={`/journey/${card.userJourneyId}`}
                className="block rounded-2xl p-4 border"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                      {card.name}
                    </div>
                    {card.routeLabel && (
                      <div className="text-xs font-medium mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        {card.routeLabel}
                      </div>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full shrink-0 ml-2"
                    style={{ color: "var(--color-accent)", background: "var(--color-accent-light)" }}
                  >
                    {percent}%
                  </span>
                </div>
                <div className="h-2 rounded mt-3" style={{ background: "var(--color-accent-light)" }}>
                  <div
                    className="h-2 rounded"
                    style={{ width: `${Math.max(Number(percent), 1)}%`, background: "var(--color-accent)" }}
                  />
                </div>
                <div className="text-xs font-semibold mt-2" style={{ color: "var(--color-text-secondary)" }}>
                  {formatDistance(card.distanceCompleted, unit)} / {formatDistance(card.totalDistance, unit)}
                </div>

                {card.nextCheckpoint && (
                  <div className="flex items-center gap-1.5 mt-2.5 rounded-lg px-2.5 py-2" style={{ background: "#FFFFFF" }}>
                    <PinIcon />
                    <span className="text-[11px] font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      Next: {card.nextCheckpoint.name} &mdash;{" "}
                      {formatDistance(card.nextCheckpoint.distance_from_start - card.distanceCompleted, unit)} away
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <Link
          href="/journey/new"
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed mt-3 p-3.5"
          style={{ borderColor: "#D6D3EF", color: "var(--color-accent)" }}
        >
          <PlusIcon />
          <span className="text-sm font-semibold">Start a new journey</span>
        </Link>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
        {value}
      </div>
      <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
        {label}
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
