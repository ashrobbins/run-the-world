"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";
import { geocodePlace } from "@/lib/geocoding";
import { haversineDistanceKm } from "@/lib/geo";
import { computeRoadGeometry } from "@/lib/journeys/road-routing";
import { applyDistanceToActiveJourneys } from "@/lib/journeys/apply-distance";
import { convertToKm } from "@/lib/units";
import type { RoutePoint } from "@/lib/journeys/route-generator";

const PENDING_ROUTE_COOKIE = "rtw_pending_route";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function getOrCreateUserJourney(
  supabase: SupabaseServerClient,
  userId: string,
  journeyId: string,
): Promise<string> {
  const { data: existing } = await supabase
    .from("user_journeys")
    .select("id")
    .eq("user_id", userId)
    .eq("journey_id", journeyId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("user_journeys")
    .insert({ user_id: userId, journey_id: journeyId })
    .select("id")
    .single();
  if (error || !created) throw error ?? new Error("Failed to start journey.");
  return created.id;
}

/** Get-or-create the user's user_journeys row for a curated journey, then go there. */
export async function startCuratedJourney(formData: FormData) {
  const journeyId = formData.get("journeyId");
  if (typeof journeyId !== "string") throw new Error("Missing journeyId.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userJourneyId = await getOrCreateUserJourney(supabase, user.id, journeyId);
  redirect(`/journey/${userJourneyId}`);
}

/** Geocodes the From/To fields, then redirects to the route-options screen. */
export async function submitCustomJourneyForm(formData: FormData) {
  const fromQuery = formData.get("from");
  const toQuery = formData.get("to");
  if (typeof fromQuery !== "string" || typeof toQuery !== "string" || !fromQuery || !toQuery) {
    redirect(`/journey/new/custom?error=${encodeURIComponent("Enter both a start and destination.")}`);
  }

  const [from, to] = await Promise.all([geocodePlace(fromQuery), geocodePlace(toQuery)]);
  if (!from || !to) {
    redirect(
      `/journey/new/custom?error=${encodeURIComponent("Couldn't find one of those places — try being more specific.")}`,
    );
  }

  const params = new URLSearchParams({
    fromName: from.name,
    fromLat: String(from.lat),
    fromLng: String(from.lng),
    fromCountry: from.countryCode,
    toName: to.name,
    toLat: String(to.lat),
    toLng: String(to.lng),
    toCountry: to.countryCode,
  });
  redirect(`/journey/new/custom/confirm?${params.toString()}`);
}

/** Stashes the chosen route (can be large — up to ~40 waypoints) in a cookie, then previews it. */
export async function chooseRouteOption(formData: FormData) {
  const route = formData.get("route");
  if (typeof route !== "string") throw new Error("Missing route.");

  const cookieStore = await cookies();
  cookieStore.set(PENDING_ROUTE_COOKIE, route, { maxAge: 60 * 30, httpOnly: true, path: "/" });
  redirect("/journey/new/custom/preview");
}

export async function readPendingRoute(): Promise<RoutePoint[] | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PENDING_ROUTE_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RoutePoint[];
  } catch {
    return null;
  }
}

/** Inserts the journey + checkpoints + user_journeys rows for the previewed route, then starts it. */
export async function createCustomJourney(formData: FormData) {
  const route = await readPendingRoute();
  if (!route || route.length < 2) redirect("/journey/new/custom");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const start = route[0];
  const end = route[route.length - 1];
  const customName = formData.get("name");
  const name = typeof customName === "string" && customName.trim() ? customName.trim() : `${start.name} → ${end.name}`;

  const distancesFromStart: number[] = [0];
  let cumulative = 0;
  for (let i = 1; i < route.length; i++) {
    cumulative += haversineDistanceKm(route[i - 1], route[i]);
    distancesFromStart.push(cumulative);
  }

  // Best-effort — never blocks journey creation if Directions is slow/unavailable.
  const routeGeometry = await computeRoadGeometry(route).catch(() => null);

  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .insert({
      name,
      description: `A custom journey from ${start.name} to ${end.name}.`,
      journey_type: "custom",
      created_by: user.id,
      start_name: start.name,
      start_lat: start.lat,
      start_lng: start.lng,
      destination_name: end.name,
      destination_lat: end.lat,
      destination_lng: end.lng,
      total_distance: cumulative,
      route_geometry: routeGeometry as unknown as Json,
      is_published: false,
    })
    .select("id")
    .single();
  if (journeyError || !journey) throw journeyError ?? new Error("Failed to create journey.");

  const checkpointRows = route.map((point, i) => ({
    journey_id: journey.id,
    name: point.name,
    country_code: point.countryCode,
    sequence_number: i + 1,
    distance_from_start: distancesFromStart[i],
    lat: point.lat,
    lng: point.lng,
  }));
  const { error: checkpointsError } = await supabase.from("checkpoints").insert(checkpointRows);
  if (checkpointsError) throw checkpointsError;

  const cookieStore = await cookies();
  cookieStore.delete(PENDING_ROUTE_COOKIE);

  const userJourneyId = await getOrCreateUserJourney(supabase, user.id, journey.id);
  redirect(`/journey/${userJourneyId}`);
}

/** Manually logs a run when Strava sync missed it — same crediting path as syncStravaActivities. */
export async function logManualActivity(formData: FormData) {
  const userJourneyId = formData.get("userJourneyId");
  const distanceRaw = formData.get("distance");
  const dateRaw = formData.get("date");
  if (typeof userJourneyId !== "string" || typeof distanceRaw !== "string" || typeof dateRaw !== "string") {
    throw new Error("Missing fields.");
  }

  const distanceValue = Number(distanceRaw);
  if (!Number.isFinite(distanceValue) || distanceValue <= 0) {
    redirect(`/journey/${userJourneyId}?error=${encodeURIComponent("Enter a distance greater than zero.")}`);
  }

  const enteredDate = new Date(dateRaw);
  if (Number.isNaN(enteredDate.getTime()) || enteredDate.getTime() > Date.now()) {
    redirect(`/journey/${userJourneyId}?error=${encodeURIComponent("Pick a valid date, not in the future.")}`);
  }
  // A bare date parses to midnight UTC, which can sort behind a same-day Strava
  // activity that has a real time-of-day. Use "now" for today's date so a fresh
  // manual log always reads as the most recent run.
  const isToday = enteredDate.toDateString() === new Date().toDateString();
  const activityDate = isToday ? new Date() : enteredDate;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("unit_preference").eq("id", user.id).maybeSingle();
  const unit = profile?.unit_preference ?? "km";
  const distanceKm = convertToKm(distanceValue, unit);

  const admin = createAdminClient();
  const { error: insertError } = await admin.from("activities").insert({
    user_id: user.id,
    source: "manual",
    activity_type: "Run",
    distance: distanceKm,
    activity_date: activityDate.toISOString(),
    counted_for_progress: true,
  });
  if (insertError) throw insertError;

  const { crossedCheckpoint } = await applyDistanceToActiveJourneys(user.id, distanceKm, userJourneyId);

  if (crossedCheckpoint) {
    redirect(`/journey/${userJourneyId}/checkpoint-unlocked?checkpointId=${crossedCheckpoint.id}`);
  }
  redirect(`/journey/${userJourneyId}`);
}
