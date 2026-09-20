import { WAYPOINT_CITIES, type WaypointCity } from "./waypoint-cities";
import { haversineDistanceKm, crossTrackDistanceKm, alongTrackFraction, type LatLng } from "@/lib/geo";

export interface RoutePoint extends LatLng {
  name: string;
  countryCode: string;
}

export interface RouteOption {
  name: string;
  badge?: "Shortest" | "Most checkpoints";
  waypoints: RoutePoint[]; // ordered, start...end inclusive
  totalDistanceKm: number;
}

interface Candidate extends WaypointCity {
  crossTrack: number;
  alongTrack: number;
}

/**
 * How many checkpoints a journey of this length should aim for. Scales
 * sub-linearly with distance so short trips still get a handful of stops
 * without huge intercontinental journeys ballooning into hundreds:
 * ~460km -> ~6, ~3,000km -> ~11, ~12,000km -> ~21.
 */
export function targetCheckpointCount(totalDistanceKm: number): number {
  return Math.min(40, Math.max(3, Math.round(2 + Math.sqrt(totalDistanceKm) / 6)));
}

function candidatesInCorridor(start: RoutePoint, end: RoutePoint, corridorKm: number): Candidate[] {
  return WAYPOINT_CITIES.map((c) => ({
    ...c,
    crossTrack: crossTrackDistanceKm(c, start, end),
    alongTrack: alongTrackFraction(c, start, end),
  }))
    .filter((c) => c.crossTrack <= corridorKm && c.alongTrack > 0.05 && c.alongTrack < 0.95)
    .sort((a, b) => a.alongTrack - b.alongTrack);
}

/**
 * Picks up to `max` candidates spread along the path, preferring the one closest
 * to the direct line (lowest cross-track) within each along-track segment — rather
 * than picking blindly by index, which can zigzag between waypoints on opposite
 * sides of a wide corridor and massively inflate the route's total distance.
 */
function pickSpaced(candidates: Candidate[], max: number): Candidate[] {
  if (max <= 0 || candidates.length === 0) return [];
  if (candidates.length <= max) return [...candidates].sort((a, b) => a.alongTrack - b.alongTrack);

  const minAlong = Math.min(...candidates.map((c) => c.alongTrack));
  const maxAlong = Math.max(...candidates.map((c) => c.alongTrack));
  const span = maxAlong - minAlong || 1;

  const picked: Candidate[] = [];
  const usedNames = new Set<string>();
  for (let i = 0; i < max; i++) {
    const bucketStart = minAlong + (i / max) * span;
    const bucketEnd = minAlong + ((i + 1) / max) * span;
    const inBucket = candidates.filter(
      (c) => c.alongTrack >= bucketStart && c.alongTrack < bucketEnd && !usedNames.has(c.name),
    );
    if (inBucket.length === 0) continue;
    const closest = inBucket.reduce((a, b) => (b.crossTrack < a.crossTrack ? b : a));
    picked.push(closest);
    usedNames.add(closest.name);
  }
  return picked.sort((a, b) => a.alongTrack - b.alongTrack);
}

function buildOption(name: string, start: RoutePoint, end: RoutePoint, waypoints: Candidate[]): RouteOption {
  const points: RoutePoint[] = [
    start,
    ...waypoints.map((w) => ({ name: w.name, countryCode: w.countryCode, lat: w.lat, lng: w.lng })),
    end,
  ];
  let totalDistanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistanceKm += haversineDistanceKm(points[i - 1], points[i]);
  }
  return { name, waypoints: points, totalDistanceKm };
}

function signature(option: RouteOption): string {
  return option.waypoints.map((w) => w.name).join("|");
}

/**
 * Generates up to 3 route options between two geocoded points by picking waypoint
 * cities near the great-circle path, at increasingly wide corridors. This is a v1
 * heuristic, not real adventure-route curation — it degrades to a single direct
 * start->end option wherever the waypoint list has no nearby coverage (e.g.
 * mid-ocean crossings, regions outside Europe/Asia/the Americas).
 */
export function generateRouteOptions(start: RoutePoint, end: RoutePoint): RouteOption[] {
  const directDistanceKm = haversineDistanceKm(start, end);
  const target = targetCheckpointCount(directDistanceKm);
  const baseCorridorKm = Math.max(80, directDistanceKm * 0.12);

  const narrow = candidatesInCorridor(start, end, baseCorridorKm * 0.5);
  const medium = candidatesInCorridor(start, end, baseCorridorKm);
  const wide = candidatesInCorridor(start, end, baseCorridorKm * 2);

  if (medium.length === 0 && wide.length === 0 && narrow.length === 0) {
    return [buildOption("The Direct Route", start, end, [])];
  }

  const candidates = [
    buildOption("The Classic Route", start, end, pickSpaced(medium, target)),
    buildOption("The Direct Route", start, end, pickSpaced(narrow, Math.max(1, Math.round(target * 0.5)))),
    buildOption("The Grand Tour", start, end, pickSpaced(wide, Math.round(target * 1.6))),
  ];

  // De-dupe options that ended up identical (e.g. a narrow corridor found nothing
  // beyond what the medium one already has).
  const seen = new Set<string>();
  const options = candidates.filter((o) => {
    const key = signature(o);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Assign badges honestly, based on the actual generated numbers rather than
  // assuming which named variant "wins".
  const shortest = options.reduce((a, b) => (b.totalDistanceKm < a.totalDistanceKm ? b : a));
  const mostCheckpoints = options.reduce((a, b) => (b.waypoints.length > a.waypoints.length ? b : a));
  if (options.length > 1) {
    shortest.badge = "Shortest";
    if (mostCheckpoints !== shortest) mostCheckpoints.badge = "Most checkpoints";
  }

  return options;
}
