import { cache } from "react";
import { createClient } from "./server";

/**
 * Request-memoized reads for the three things almost every (app) page needs: the
 * signed-in user, their profile, and their Strava connection. Without this, the
 * layout and every page independently re-fetched all three on every navigation —
 * wrapping them in React's cache() means each is fetched at most once per request,
 * shared between the layout and whichever page is rendering alongside it.
 */

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("unit_preference, display_name")
    .eq("id", userId)
    .maybeSingle();
  return data;
});

export const getStravaConnection = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("strava_connections")
    .select("id, strava_athlete_id, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
});
