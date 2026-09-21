import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { classifyCheckpoints } from "@/lib/journeys/progress";
import { formatDistance } from "@/lib/units";
import { InteractiveJourneyMap } from "@/components/journey/InteractiveJourneyMap";

export default async function JourneyMapPage({
  params,
  searchParams,
}: {
  params: Promise<{ userJourneyId: string }>;
  searchParams: Promise<{ focus?: string }>;
}) {
  const { userJourneyId } = await params;
  const { focus } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userJourney } = await supabase
    .from("user_journeys")
    .select("id, distance_completed, journey_id, journeys(start_name, destination_name, route_geometry)")
    .eq("id", userJourneyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!userJourney) notFound();

  const journey = Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys;

  const { data: checkpoints } = await supabase
    .from("checkpoints")
    .select("id, name, distance_from_start, lat, lng")
    .eq("journey_id", userJourney.journey_id)
    .order("sequence_number", { ascending: true });

  if (!checkpoints || checkpoints.length === 0) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();
  const unit = profile?.unit_preference ?? "km";

  const classified = classifyCheckpoints(checkpoints, userJourney.distance_completed);
  const nextCheckpoint = classified.find((c) => c.state === "next");
  const currentLocationLabel = nextCheckpoint ? `Somewhere before ${nextCheckpoint.name}` : "Journey complete";
  const focusCheckpoint = focus ? checkpoints.find((c) => c.id === focus) : undefined;

  return (
    <InteractiveJourneyMap
      userJourneyId={userJourney.id}
      routeLabel={`${journey.start_name} → ${journey.destination_name}`}
      checkpoints={checkpoints}
      distanceCompleted={userJourney.distance_completed}
      totalDistance={checkpoints[checkpoints.length - 1].distance_from_start}
      routeGeometry={journey.route_geometry as { coordinates: [number, number][] } | null}
      currentLocationLabel={currentLocationLabel}
      focusCheckpoint={focusCheckpoint ? { lat: focusCheckpoint.lat, lng: focusCheckpoint.lng, name: focusCheckpoint.name } : null}
      nextCheckpoint={
        nextCheckpoint
          ? {
              name: nextCheckpoint.name,
              distanceAwayLabel: formatDistance(nextCheckpoint.distance_from_start - userJourney.distance_completed, unit),
            }
          : null
      }
    />
  );
}
