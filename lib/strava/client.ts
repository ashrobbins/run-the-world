import "server-only";
import { z } from "zod";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

/**
 * The fields we actually persist, mapped out of Strava's activity object — this
 * subset documents the derive-then-discard boundary for storage: nothing beyond
 * id/type/distance/start_date is ever written to the `activities` table. See raw
 * Strava fields at
 * https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
 * for what we deliberately never persist (GPS polyline, photos, heart rate, etc).
 *
 * `name`, `start_latlng` and `total_elevation_gain` are the exception: they're kept
 * on this schema so the "just synced" notification can show a richer summary, but
 * lib/strava/import.ts only ever uses them for that one response — never for a DB
 * write. They're gone as soon as the request completes, same as everything else
 * that isn't in the four persisted columns.
 */
export const stravaActivitySchema = z.object({
  id: z.number(),
  type: z.string(), // e.g. "Run", "TrailRun", "VirtualRun"
  distance: z.number(), // meters
  start_date: z.string(), // ISO 8601
  name: z.string().optional(),
  start_latlng: z.tuple([z.number(), z.number()]).nullable().optional(),
  total_elevation_gain: z.number().optional(),
});

export type StravaActivity = z.infer<typeof stravaActivitySchema>;

const stravaActivityListSchema = z.array(stravaActivitySchema);

/**
 * Fetches activities newer than `afterUnixSeconds`, validates the response shape,
 * and returns only the narrow fields defined above. The raw fetch response body is
 * never returned or logged — see lib/strava/import.ts for how this is consumed.
 */
export async function fetchActivitiesSince(
  accessToken: string,
  afterUnixSeconds: number,
): Promise<StravaActivity[]> {
  const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
  url.searchParams.set("after", String(afterUnixSeconds));
  url.searchParams.set("per_page", "50");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Strava activities request failed: ${response.status}`);
  }

  const raw = await response.json();
  const parsed = stravaActivityListSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Strava activities response failed validation: ${parsed.error.message}`,
    );
  }
  // `raw` goes out of scope here — nothing beyond `parsed.data` propagates further.
  return parsed.data;
}

export async function deauthorize(accessToken: string): Promise<void> {
  const response = await fetch("https://www.strava.com/oauth/deauthorize", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Strava deauthorize failed: ${response.status}`);
  }
}
