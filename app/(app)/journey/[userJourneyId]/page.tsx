import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressStat } from "@/components/journey/ProgressStat";
import { CheckpointStampsRow } from "@/components/journey/CheckpointStampsRow";
import { MapCard } from "@/components/journey/MapCard";
import { LastRunCard } from "@/components/journey/LastRunCard";
import { DeleteJourneyButton } from "@/components/journey/DeleteJourneyButton";
import { SyncNowButton } from "@/components/strava/SyncNowButton";
import { classifyCheckpoints } from "@/lib/journeys/progress";
import { formatDistance } from "@/lib/units";

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ userJourneyId: string }>;
}) {
  const { userJourneyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userJourney } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journey_id, journeys(name, total_distance, start_name, destination_name)")
    .eq("id", userJourneyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!userJourney) notFound();

  const journey = Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys;
  const routeLabel = `${journey.start_name} → ${journey.destination_name}`;
  const showRouteLabel = journey.name !== routeLabel;

  const { data: checkpoints } = await supabase
    .from("checkpoints")
    .select("id, name, country_code, distance_from_start, lat, lng")
    .eq("journey_id", userJourney.journey_id)
    .order("sequence_number", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();
  const unit = profile?.unit_preference ?? "km";

  const { data: lastActivity } = await supabase
    .from("activities")
    .select("distance, activity_date")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const classified = checkpoints ? classifyCheckpoints(checkpoints, userJourney.distance_completed) : [];
  const nextCheckpoint = classified.find((c) => c.state === "next");

  const currentLocationLabel = nextCheckpoint
    ? `Somewhere before ${nextCheckpoint.name}`
    : "Journey complete";

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-row items-center justify-between px-6 pt-5 pb-1">
        <Link href="/home" aria-label="Back">
          <BackIcon />
        </Link>
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
            Active journey
          </div>
          <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {journey.name}
          </div>
          {showRouteLabel && (
            <div className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {routeLabel}
            </div>
          )}
        </div>
        <span className="w-5" />
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <ProgressStat
          distanceCompleted={userJourney.distance_completed}
          totalDistance={journey.total_distance}
          unit={unit}
        />

        {checkpoints && checkpoints.length > 0 && (
          <>
            <CheckpointStampsRow checkpoints={checkpoints} distanceCompleted={userJourney.distance_completed} />
            <MapCard
              checkpoints={checkpoints}
              distanceCompleted={userJourney.distance_completed}
              locationLabel={currentLocationLabel}
            />
          </>
        )}

        {lastActivity && (
          <LastRunCard distanceKm={lastActivity.distance} date={lastActivity.activity_date} unit={unit} />
        )}

        {nextCheckpoint && (
          <div
            className="flex items-center justify-between mt-3 rounded-2xl px-4 py-3.5"
            style={{ background: "var(--color-accent-light)" }}
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>
                Next checkpoint
              </div>
              <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-text-primary)" }}>
                {nextCheckpoint.name} &mdash;{" "}
                {formatDistance(nextCheckpoint.distance_from_start - userJourney.distance_completed, unit)} away
              </div>
            </div>
          </div>
        )}

        <SyncNowButton userJourneyId={userJourney.id} />

        <p className="text-center text-xs mt-3" style={{ color: "var(--color-text-faint)" }}>
          Strava sync missed a run?{" "}
          <span style={{ color: "var(--color-text-secondary)" }}>Log it manually (coming soon)</span>
        </p>

        <div className="flex justify-center pb-4">
          <DeleteJourneyButton userJourneyId={userJourney.id} journeyName={journey.name} />
        </div>
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
