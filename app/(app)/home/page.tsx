import Link from "next/link";
import { startOfWeek } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { LinkWithStravaCta } from "@/components/strava/LinkWithStravaCta";
import { formatDistance } from "@/lib/units";
import { classifyCheckpoints } from "@/lib/journeys/progress";

// The single seeded journey for Phase 1 — see supabase/seed.sql.
const SEEDED_JOURNEY_ID = "00000000-0000-0000-0000-000000000001";

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

  // Phase 1: ensure the user has an active user_journeys row for the seeded journey.
  let { data: userJourney } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journeys(id, name, total_distance)")
    .eq("user_id", user.id)
    .eq("journey_id", SEEDED_JOURNEY_ID)
    .maybeSingle();

  if (!userJourney) {
    const { data: created } = await supabase
      .from("user_journeys")
      .insert({ user_id: user.id, journey_id: SEEDED_JOURNEY_ID })
      .select("id, distance_completed, journeys(id, name, total_distance)")
      .single();
    userJourney = created ?? null;
  }

  if (!userJourney) {
    return <p className="p-6 text-sm">Couldn&rsquo;t load your journey — try refreshing.</p>;
  }

  const journey = Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys;
  const percent = ((userJourney.distance_completed / journey.total_distance) * 100).toFixed(1);

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();
  const unit = profile?.unit_preference ?? "km";

  // Hero stats: active journeys, stamps collected, distance run this week.
  const { count: activeJourneyCount } = await supabase
    .from("user_journeys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  const { data: checkpoints } = await supabase
    .from("checkpoints")
    .select("id, name, distance_from_start")
    .eq("journey_id", journey.id);
  const classifiedCheckpoints = checkpoints
    ? classifyCheckpoints(checkpoints, userJourney.distance_completed)
    : [];
  const stampsCollected = classifiedCheckpoints.filter((c) => c.state === "reached").length;
  const nextCheckpoint = classifiedCheckpoints.find((c) => c.state === "next");

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
            You&rsquo;ve run {formatDistance(userJourney.distance_completed, unit)} across{" "}
            {activeJourneyCount ?? 1} journey{(activeJourneyCount ?? 1) === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-5 mt-4">
          <HeroStat value={activeJourneyCount ?? 1} label="Active journeys" />
          <HeroStat value={stampsCollected} label="Stamps collected" />
          <HeroStat value={formatDistance(distanceThisWeek, unit)} label={`this week`} />
        </div>
      </div>

      {/* Journeys */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            Your journeys
          </h1>
        </div>

        <Link
          href={`/journey/${userJourney.id}`}
          className="block rounded-2xl p-4 border mt-3"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
              {journey.name}
            </span>
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
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
            {formatDistance(userJourney.distance_completed, unit)} / {formatDistance(journey.total_distance, unit)}
          </div>

          {nextCheckpoint && (
            <div
              className="flex items-center gap-1.5 mt-2.5 rounded-lg px-2.5 py-2"
              style={{ background: "#FFFFFF" }}
            >
              <PinIcon />
              <span className="text-[11px] font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Next: {nextCheckpoint.name} &mdash;{" "}
                {formatDistance(nextCheckpoint.distance_from_start - userJourney.distance_completed, unit)} away
              </span>
            </div>
          )}
        </Link>

        <div
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed mt-3 p-3.5"
          style={{ borderColor: "#D6D3EF", color: "var(--color-accent)" }}
          title="Journey library & custom routes are coming in a later phase"
        >
          <PlusIcon />
          <span className="text-sm font-semibold">Start a new journey</span>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-faint)" }}>
            (coming soon)
          </span>
        </div>
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
