import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/supabase/session";
import { classifyCheckpoints } from "@/lib/journeys/progress";
import { PassportContent, type PassportStamp } from "@/components/passport/PassportContent";

interface CheckpointRow {
  id: string;
  journey_id: string;
  name: string;
  country_code: string;
  distance_from_start: number;
  checkpoint_landmarks: { name: string; icon_key: string; sequence_number: number }[];
}

export default async function PassportPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const [{ data: userJourneys }, profile, { data: lastActivity }] = await Promise.all([
    supabase
      .from("user_journeys")
      .select("id, distance_completed, journeys(id, name, start_name, destination_name)")
      .eq("user_id", user.id),
    getProfile(user.id),
    supabase
      .from("activities")
      .select("activity_date")
      .eq("user_id", user.id)
      .order("activity_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const unit = profile?.unit_preference ?? "km";

  const journeyIds = (userJourneys ?? [])
    .map((uj) => (Array.isArray(uj.journeys) ? uj.journeys[0]?.id : uj.journeys?.id))
    .filter((id): id is string => Boolean(id));

  const { data: allCheckpoints } = journeyIds.length
    ? await supabase
        .from("checkpoints")
        .select("id, journey_id, name, country_code, distance_from_start, checkpoint_landmarks(name, icon_key, sequence_number)")
        .in("journey_id", journeyIds)
    : { data: [] as CheckpointRow[] };

  const checkpointsByJourney = new Map<string, CheckpointRow[]>();
  for (const cp of allCheckpoints ?? []) {
    const list = checkpointsByJourney.get(cp.journey_id) ?? [];
    list.push(cp);
    checkpointsByJourney.set(cp.journey_id, list);
  }

  const stamps: PassportStamp[] = [];
  let journeyCount = 0;

  for (const uj of userJourneys ?? []) {
    const journey = Array.isArray(uj.journeys) ? uj.journeys[0] : uj.journeys;
    if (!journey) continue;
    journeyCount++;
    const routeLabel = `${journey.start_name} → ${journey.destination_name}`;

    const checkpoints = checkpointsByJourney.get(journey.id) ?? [];
    const withLandmarks = checkpoints.map((c) => ({
      ...c,
      landmarks: [...(c.checkpoint_landmarks ?? [])].sort((a, b) => a.sequence_number - b.sequence_number),
    }));

    const classified = classifyCheckpoints(withLandmarks, uj.distance_completed);
    for (const c of classified) {
      stamps.push({
        ...c,
        userJourneyId: uj.id,
        routeLabel,
        journeyDistanceCompleted: uj.distance_completed,
      });
    }
  }

  const reached = stamps.filter((s) => s.state === "reached");
  const reachedCount = reached.length;

  // "Most recent" without a per-checkpoint crossing timestamp: the reached stamp
  // with the smallest overshoot past its own journey's current progress is the
  // one most recently crossed relative to where the runner is now.
  const mostRecentStamp =
    reached.length > 0
      ? reached.reduce((closest, s) =>
          s.journeyDistanceCompleted - s.distance_from_start < closest.journeyDistanceCompleted - closest.distance_from_start
            ? s
            : closest,
        )
      : null;

  return (
    <div className="px-6 pt-6 pb-6">
      <h1 className="text-lg font-bold text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
        My Passport
      </h1>
      <p className="text-center text-xs mt-1 mb-5" style={{ color: "var(--color-text-secondary)" }}>
        {reachedCount} stamp{reachedCount === 1 ? "" : "s"} collected across {journeyCount} journey
        {journeyCount === 1 ? "" : "s"}
      </p>

      <PassportContent stamps={stamps} mostRecentStamp={mostRecentStamp} unit={unit} lastActivityDate={lastActivity?.activity_date ?? null} />
    </div>
  );
}
