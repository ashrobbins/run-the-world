import "server-only";
import { z } from "zod";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

/**
 * The fields we actually keep, mapped out of Strava's activity object. This schema
 * is intentionally narrow — it documents the derive-then-discard boundary: nothing
 * beyond these fields should ever leave lib/strava/import.ts. See raw Strava fields
 * at https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
 * for what we are deliberately NOT capturing (GPS polyline, photos, heart rate, etc).
 */
export const stravaActivitySchema = z.object({
  id: z.number(),
  type: z.string(), // e.g. "Run", "TrailRun", "VirtualRun"
  distance: z.number(), // meters
  start_date: z.string(), // ISO 8601
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
