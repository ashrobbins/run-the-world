import "server-only";
import type { LatLng } from "@/lib/geo";

export interface GeoLineString {
  type: "LineString";
  coordinates: [number, number][]; // [lng, lat] pairs, GeoJSON order
}

/**
 * Fetches a real driving-road-snapped path for one leg via Mapbox Directions.
 * Returns null (rather than throwing) when no route exists — e.g. an ocean
 * crossing — so the caller can fall back to a straight line for that leg only.
 */
async function fetchLegGeometry(from: LatLng, to: LatLng): Promise<[number, number][] | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`);
  url.searchParams.set("geometries", "geojson");
  // "simplified" (not "full") — full returns thousands of points even for a single
  // leg, which blows past the Static Images API's URL length limit once combined
  // across a whole route. Simplified is still visually a real road-following path.
  url.searchParams.set("overview", "simplified");
  url.searchParams.set("access_token", token);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return route.geometry.coordinates as [number, number][];
  } catch {
    return null;
  }
}

/**
 * Builds one combined road-following GeoJSON LineString across every leg of a
 * route. Legs with no drivable path (oceans, etc.) fall back to a straight
 * two-point segment for just that leg, so the overall line stays continuous.
 * Never throws — worst case, every leg falls back and the result is just the
 * straight-line route (same as not having this at all).
 */
export async function computeRoadGeometry(points: LatLng[]): Promise<GeoLineString | null> {
  if (points.length < 2) return null;

  const legResults = await Promise.all(
    points.slice(0, -1).map((point, i) => fetchLegGeometry(point, points[i + 1])),
  );

  const coordinates: [number, number][] = [];
  for (let i = 0; i < legResults.length; i++) {
    const leg = legResults[i];
    const from = points[i];
    const to = points[i + 1];
    const legCoords: [number, number][] = leg ?? [
      [from.lng, from.lat],
      [to.lng, to.lat],
    ];

    // Skip the first point of every leg after the first — it's the same as the
    // previous leg's last point, so this avoids a duplicated coordinate at joins.
    const startIndex = i === 0 ? 0 : 1;
    for (let j = startIndex; j < legCoords.length; j++) {
      coordinates.push(legCoords[j]);
    }
  }

  if (coordinates.length < 2) return null;
  return { type: "LineString", coordinates };
}
