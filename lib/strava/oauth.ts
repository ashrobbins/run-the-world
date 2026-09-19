import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const STRAVA_AUTH_BASE = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

export function buildStravaAuthorizeUrl(state: string): string {
  const url = new URL(STRAVA_AUTH_BASE);
  url.searchParams.set("client_id", process.env.STRAVA_CLIENT_ID!);
  url.searchParams.set("redirect_uri", process.env.STRAVA_REDIRECT_URI!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", "read,activity:read_all");
  url.searchParams.set("state", state);
  return url.toString();
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  athlete?: { id: number };
}

async function exchangeToken(body: Record<string, string>): Promise<StravaTokenResponse> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      ...body,
    }),
  });
  if (!response.ok) {
    throw new Error(`Strava token request failed: ${response.status}`);
  }
  return response.json();
}

/** Exchanges an OAuth `code` for tokens and stores the connection for `userId`. */
export async function connectStravaAccount(userId: string, code: string) {
  const tokens = await exchangeToken({ code, grant_type: "authorization_code" });
  const admin = createAdminClient();

  const { error } = await admin.from("strava_connections").upsert(
    {
      user_id: userId,
      strava_athlete_id: tokens.athlete?.id ?? 0,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(tokens.expires_at * 1000).toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

/**
 * Returns a valid Strava access token for `userId`, refreshing it first if expired.
 * Every Strava API call in this app should go through this function — it's the single
 * place token refresh logic lives.
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: connection, error } = await admin
    .from("strava_connections")
    .select("access_token, refresh_token, token_expires_at")
    .eq("user_id", userId)
    .single();

  if (error || !connection) {
    throw new Error("No Strava connection found for this user.");
  }

  const expiresAt = new Date(connection.token_expires_at).getTime();
  const isExpired = expiresAt <= Date.now() + 60_000; // refresh a minute early

  if (!isExpired) {
    return connection.access_token;
  }

  const refreshed = await exchangeToken({
    grant_type: "refresh_token",
    refresh_token: connection.refresh_token,
  });

  const { error: updateError } = await admin
    .from("strava_connections")
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      token_expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
    })
    .eq("user_id", userId);
  if (updateError) throw updateError;

  return refreshed.access_token;
}

/** Removes the stored Strava connection for `userId` after deauthorizing with Strava. */
export async function disconnectStravaAccount(userId: string, accessToken: string) {
  const { deauthorize } = await import("@/lib/strava/client");
  await deauthorize(accessToken);

  const admin = createAdminClient();
  const { error } = await admin
    .from("strava_connections")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
