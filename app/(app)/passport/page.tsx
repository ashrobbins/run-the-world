import { createClient } from "@/lib/supabase/server";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { classifyCheckpoints } from "@/lib/journeys/progress";

export default async function PassportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userJourneys } = await supabase
    .from("user_journeys")
    .select("distance_completed, journeys(id, name)")
    .eq("user_id", user.id);

  const stamps: Array<{ id: string; name: string; country_code: string; state: "reached" | "next" | "locked" }> = [];

  for (const uj of userJourneys ?? []) {
    const journey = Array.isArray(uj.journeys) ? uj.journeys[0] : uj.journeys;
    if (!journey) continue;
    const { data: checkpoints } = await supabase
      .from("checkpoints")
      .select("id, name, country_code, distance_from_start")
      .eq("journey_id", journey.id);
    if (!checkpoints) continue;
    stamps.push(...classifyCheckpoints(checkpoints, uj.distance_completed));
  }

  const reachedCount = stamps.filter((s) => s.state === "reached").length;

  return (
    <div className="px-6 pt-6 pb-6">
      <h1 className="text-lg font-bold text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
        My Passport
      </h1>
      <p className="text-center text-xs mt-1 mb-5" style={{ color: "var(--color-text-secondary)" }}>
        {reachedCount} stamp{reachedCount === 1 ? "" : "s"} collected
      </p>

      {stamps.length === 0 ? (
        <p className="text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Start a journey and your first stamp will show up here.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {stamps.map((stamp) => (
            <CheckpointMarker
              key={stamp.id}
              countryCode={stamp.country_code}
              state={stamp.state}
              label={stamp.name}
              size={58}
            />
          ))}
        </div>
      )}
    </div>
  );
}
