import { createClient } from "@/lib/supabase/server";
import { classifyCheckpoints } from "@/lib/journeys/progress";
import { PassportContent, type PassportStamp } from "@/components/passport/PassportContent";

export default async function PassportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userJourneys } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journeys(id, name, start_name, destination_name)")
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();
  const unit = profile?.unit_preference ?? "km";

  const { data: lastActivity } = await supabase
    .from("activities")
    .select("activity_date")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stamps: PassportStamp[] = [];
  let journeyCount = 0;

  for (const uj of userJourneys ?? []) {
    const journey = Array.isArray(uj.journeys) ? uj.journeys[0] : uj.journeys;
    if (!journey) continue;
    journeyCount++;
    const routeLabel = `${journey.start_name} → ${journey.destination_name}`;

    const { data: checkpoints } = await supabase
      .from("checkpoints")
      .select("id, name, country_code, distance_from_start, checkpoint_landmarks(name, icon_key, sequence_number)")
      .eq("journey_id", journey.id);
    if (!checkpoints) continue;

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
