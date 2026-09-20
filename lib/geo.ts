export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points, in km. */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function bearingRad(from: LatLng, to: LatLng): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return Math.atan2(y, x);
}

/**
 * Perpendicular ("cross-track") distance in km from `point` to the great-circle path
 * running from `start` to `end`. ~0 for a point on the path, growing as it strays off.
 */
export function crossTrackDistanceKm(point: LatLng, start: LatLng, end: LatLng): number {
  const d13 = haversineDistanceKm(start, point) / EARTH_RADIUS_KM;
  const theta13 = bearingRad(start, point);
  const theta12 = bearingRad(start, end);
  return Math.abs(Math.asin(Math.sin(d13) * Math.sin(theta13 - theta12)) * EARTH_RADIUS_KM);
}

/**
 * How far along the start->end path `point`'s projection falls, as a fraction
 * (0 = at start, 1 = at end; can fall outside [0,1] if the point projects beyond
 * either end). Used to filter waypoints to ones that sit "between" start and end.
 */
export function alongTrackFraction(point: LatLng, start: LatLng, end: LatLng): number {
  const totalDistance = haversineDistanceKm(start, end);
  if (totalDistance === 0) return 0;

  const d13 = haversineDistanceKm(start, point) / EARTH_RADIUS_KM;
  const theta13 = bearingRad(start, point);
  const theta12 = bearingRad(start, end);

  // atan2-based along-track distance (rather than the more common acos-based one):
  // acos only returns [0, pi], so it can't tell "behind the start" from "ahead of
  // it" — a point behind start would still come back with a positive along-track
  // distance, which is wrong. atan2 preserves the sign, so points behind the start
  // correctly come out negative and get filtered out by callers.
  const alongTrack = Math.atan2(Math.sin(d13) * Math.cos(theta13 - theta12), Math.cos(d13)) * EARTH_RADIUS_KM;

  return alongTrack / totalDistance;
}
