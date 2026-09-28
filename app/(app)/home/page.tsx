import Link from "next/link";
import { startOfWeek, startOfDay, addDays, formatDistanceToNowStrict } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { LinkWithStravaCta } from "@/components/strava/LinkWithStravaCta";
import { formatDistance, type UnitPreference } from "@/lib/units";
import { classifyCheckpoints, type CheckpointState } from "@/lib/journeys/progress";

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

  const { data: userJourneysRaw } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journeys(id, name, total_distance, start_name, destination_name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: true });
  const userJourneys = userJourneysRaw ?? [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference, display_name")
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

  const now = new Date();
  const weekStartDate = startOfWeek(now, { weekStartsOn: 1 });
  const weekStart = weekStartDate.toISOString();
  const { data: thisWeekActivities } = await supabase
    .from("activities")
    .select("distance, activity_date")
    .eq("user_id", user.id)
    .gte("activity_date", weekStart);
  const distanceThisWeek = (thisWeekActivities ?? []).reduce((sum, a) => sum + a.distance, 0);

  const activeDayKeys = new Set(
    (thisWeekActivities ?? []).map((a) => startOfDay(new Date(a.activity_date)).toDateString()),
  );
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStartDate, i);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }).charAt(0),
      isToday: date.toDateString() === now.toDateString(),
      active: activeDayKeys.has(startOfDay(date).toDateString()),
    };
  });

  const { data: lastActivity } = await supabase
    .from("activities")
    .select("activity_date, source")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const greeting = getGreeting(now, profile?.display_name ?? null);
  const dateLabel = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="px-6 pt-10 pb-7 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
          {dateLabel}
        </p>
        <div className="text-[26px] font-bold mt-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          {greeting}
        </div>
        <p className="text-sm font-medium mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
          {cards.length === 0
            ? "Pick a journey and your runs will start moving you along it."
            : `You’ve run ${formatDistance(totalDistanceAllJourneys, unit)} across ${cards.length} journey${cards.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Weekly stats card */}
      <div className="px-6">
        <div
          className="rounded-2xl px-4 py-4"
          style={{
            background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)",
            boxShadow: "0 14px 28px -10px rgba(74, 58, 180, 0.45)",
          }}
        >
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl px-3 py-3" style={{ background: "#FFFFFF" }}>
              <div className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                {formatDistance(distanceThisWeek, unit)}
              </div>
              <div className="text-[11px] font-medium mt-1" style={{ color: "var(--color-text-secondary)" }}>
                This week
              </div>
            </div>
            <div className="rounded-2xl px-3 py-3" style={{ background: "rgba(255,255,255,0.14)" }}>
              <div className="text-2xl font-bold text-white leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                {cards.length}
              </div>
              <div className="text-[11px] font-medium mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                Active journeys
              </div>
            </div>
            <div className="rounded-2xl px-3 py-3" style={{ background: "rgba(255,255,255,0.14)" }}>
              <div className="text-2xl font-bold text-white leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                {totalStampsCollected}
              </div>
              <div className="text-[11px] font-medium mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                Stamps collected
              </div>
            </div>
          </div>

          {/* This week, Monday to Sunday */}
          <div className="flex items-center justify-between mt-2.5 rounded-2xl px-3.5 py-3" style={{ background: "rgba(255,255,255,0.12)" }}>
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: day.active ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                    boxShadow: day.isToday ? "0 0 0 2px rgba(255,255,255,0.5)" : "none",
                  }}
                />
                <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-medium mt-3 text-center" style={{ color: "var(--color-text-secondary)" }}>
          {lastActivity
            ? `Last synced ${formatDistanceToNowStrict(new Date(lastActivity.activity_date), { addSuffix: true })}${lastActivity.source === "manual" ? " (manual)" : ""}`
            : "No activity synced yet"}
        </p>
      </div>

      {/* Journeys */}
      <div className="px-6 pt-6 pb-6">
        {cards.length === 0 ? (
          <Link
            href="/journey/new"
            className="block rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Start your first journey
            </div>
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              Pick a curated route or plan your own — your runs will move you along it automatically.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 mt-4">
              <PlusIcon />
              <span className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
                Choose a journey
              </span>
            </div>
          </Link>
        ) : (
          <>
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
                    style={{ background: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
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
                        style={{ color: "var(--color-progress)", background: "var(--color-progress-light)" }}
                      >
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 rounded mt-3" style={{ background: "var(--color-progress-light)" }}>
                      <div
                        className="h-2 rounded"
                        style={{ width: `${Math.max(Number(percent), 1)}%`, background: "var(--color-progress)" }}
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
          </>
        )}

        <Link
          href="/journey/archive"
          className="block text-center text-xs font-semibold mt-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          View journey archive
        </Link>
      </div>
    </div>
  );
}

function getGreeting(now: Date, name: string | null): string {
  const hour = now.getHours();
  if (hour < 5) return name ? `Still going, ${name}?` : "Still going?";
  const timeOfDay = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  return name ? `${timeOfDay}, ${name}` : timeOfDay;
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
