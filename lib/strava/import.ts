import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getValidAccessToken } from "@/lib/strava/oauth";
import { fetchActivitiesSince } from "@/lib/strava/client";
import { reverseGeocode } from "@/lib/geocoding";
import { applyDistanceToActiveJourneys } from "@/lib/journeys/apply-distance";

const RUNNING_TYPES = new Set(["Run", "TrailRun", "VirtualRun"]);
const METERS_PER_KM = 1000;

export interface SyncedActivitySummary {
  name: string;
  distanceKm: number;
  date: string;
  type: string;
  locationLabel: string | null;
  elevationGainM: number | null;
}

export interface SyncResult {
  newActivityCount: number;
  distanceAdded: number; // km
  totalDistance: number; // km, after this sync
  lastRun: { distanceKm: number; date: string } | null;
  crossedCheckpoint: { id: string; name: string } | null;
  journeysCredited: number;
  focusUserJourneyId: string;
  /** Transient-only summary of the most recently-synced new activity, for the
   * "just synced" notification — built from fields never persisted beyond this
   * one response (see stravaActivitySchema). Null when nothing new was found. */
  syncedActivity: SyncedActivitySummary | null;
}

/**
 * The derive-then-discard pipeline: fetch recent Strava activities, map each one down
 * to only the fields we keep (see stravaActivitySchema in lib/strava/client.ts),
 * insert them idempotently, and update the user's active journey progress. The raw
 * Strava activity objects fetched here never leave this function's scope — nothing
 * raw is logged, cached, or persisted beyond the four narrow columns on `activities`
 * (name/location/elevation are used only to build `syncedActivity` for the response).
 */
export async function syncStravaActivities(userId: string, focusJourneyId?: string): Promise<SyncResult> {
  const admin = createAdminClient();

  const { data: lastKnownActivity } = await admin
    .from("activities")
    .select("activity_date")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const afterUnixSeconds = lastKnownActivity
    ? Math.floor(new Date(lastKnownActivity.activity_date).getTime() / 1000)
    : Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60; // first sync: last 90 days

  const accessToken = await getValidAccessToken(userId);
  const rawActivities = await fetchActivitiesSince(accessToken, afterUnixSeconds);
  const runningActivities = rawActivities.filter((a) => RUNNING_TYPES.has(a.type));

  // Map immediately — `rawActivities` itself is not touched again after this block,
  // only `runningActivities` (for the transient summary below).
  const toInsert = runningActivities.map((a) => ({
    user_id: userId,
    strava_activity_id: a.id,
    source: "strava" as const,
    activity_type: a.type,
    distance: a.distance / METERS_PER_KM,
    activity_date: a.start_date,
    counted_for_progress: true,
  }));

  let distanceAdded = 0;
  let newActivityCount = 0;
  let syncedActivity: SyncedActivitySummary | null = null;

  if (toInsert.length > 0) {
    const { data: inserted, error: insertError } = await admin
      .from("activities")
      .upsert(toInsert, { onConflict: "user_id,strava_activity_id", ignoreDuplicates: true })
      .select("distance, strava_activity_id");
    if (insertError) throw insertError;

    newActivityCount = inserted?.length ?? 0;
    distanceAdded = (inserted ?? []).reduce((sum, row) => sum + row.distance, 0);

    const insertedIds = new Set((inserted ?? []).map((row) => row.strava_activity_id));
    const newlySynced = runningActivities
      .filter((a) => insertedIds.has(a.id))
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    const latest = newlySynced[0];

    if (latest) {
      const hasRealLatLng =
        latest.start_latlng && (latest.start_latlng[0] !== 0 || latest.start_latlng[1] !== 0);
      const locationLabel = hasRealLatLng
        ? await reverseGeocode(latest.start_latlng![0], latest.start_latlng![1])
        : null;

      syncedActivity = {
        name: latest.name ?? latest.type,
        distanceKm: latest.distance / METERS_PER_KM,
        date: latest.start_date,
        type: latest.type,
        locationLabel,
        elevationGainM: latest.total_elevation_gain ?? null,
      };
    }
  }

  const { totalDistance, crossedCheckpoint, journeysCredited, focusUserJourneyId } = await applyDistanceToActiveJourneys(
    userId,
    distanceAdded,
    focusJourneyId,
  );

  const { data: lastRunRow } = await admin
    .from("activities")
    .select("distance, activity_date")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    newActivityCount,
    distanceAdded,
    totalDistance,
    lastRun: lastRunRow
      ? { distanceKm: lastRunRow.distance, date: lastRunRow.activity_date }
      : null,
    crossedCheckpoint,
    journeysCredited,
    focusUserJourneyId,
    syncedActivity,
  };
}
