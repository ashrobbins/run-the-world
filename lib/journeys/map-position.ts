import { haversineDistanceKm, type LatLng } from "@/lib/geo";

export interface CheckpointLike extends LatLng {
  distance_from_start: number;
}

export function nearestCheckpointKm<T extends CheckpointLike>(checkpoints: T[], distanceCompleted: number): number {
  return Math.min(...checkpoints.map((c) => Math.abs(c.distance_from_start - distanceCompleted)));
}

/**
 * Splits a line (route_geometry coordinates, or a straight fallback line) into
 * "traveled" and "remaining" halves at the given fraction of its own length —
 * used to draw the journey map's route in two tones. Approximate by design: the
 * geometry's own cumulative length rarely matches the journey's real total
 * distance exactly, so this just walks the line proportionally.
 */
export function splitLineAtFraction(points: LatLng[], fraction: number): { traveled: LatLng[]; remaining: LatLng[] } {
  if (points.length < 2) return { traveled: points, remaining: points };
  const clamped = Math.max(0, Math.min(1, fraction));

  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const d = haversineDistanceKm(points[i - 1], points[i]);
    segmentLengths.push(d);
    totalLength += d;
  }
  if (totalLength === 0) return { traveled: points, remaining: points };

  const targetLength = totalLength * clamped;
  const traveled: LatLng[] = [points[0]];
  let covered = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLength = segmentLengths[i];
    if (covered + segLength < targetLength) {
      traveled.push(points[i + 1]);
      covered += segLength;
      continue;
    }
    const segT = segLength === 0 ? 0 : (targetLength - covered) / segLength;
    const cut: LatLng = {
      lat: points[i].lat + (points[i + 1].lat - points[i].lat) * segT,
      lng: points[i].lng + (points[i + 1].lng - points[i].lng) * segT,
    };
    traveled.push(cut);
    const remaining = [cut, ...points.slice(i + 1)];
    return { traveled, remaining };
  }

  return { traveled: points, remaining: [points[points.length - 1]] };
}
