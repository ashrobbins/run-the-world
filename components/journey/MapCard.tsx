import Link from "next/link";
import { encodePolyline } from "@/lib/polyline";
import { interpolatePosition, nearestCheckpointKm, type CheckpointLike } from "@/lib/journeys/map-position";

interface Checkpoint extends CheckpointLike {
  name: string;
}

const CITY_ZOOM_THRESHOLD_KM = 15;

export function MapCard({
  userJourneyId,
  checkpoints,
  distanceCompleted,
  locationLabel,
  routeGeometry,
}: {
  userJourneyId: string;
  checkpoints: Checkpoint[];
  distanceCompleted: number;
  locationLabel: string;
  routeGeometry?: { coordinates: [number, number][] } | null;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const position = interpolatePosition(checkpoints, distanceCompleted);
  const isNearCity = nearestCheckpointKm(checkpoints, distanceCompleted) <= CITY_ZOOM_THRESHOLD_KM;
  const zoom = isNearCity ? 11 : 4;

  // Prefer the real road-following geometry (from lib/journeys/road-routing.ts,
  // computed once at journey creation) when present; fall back to a straight
  // line through the checkpoints for older/failed journeys.
  const pathPoints = routeGeometry?.coordinates.length
    ? routeGeometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
    : [...checkpoints].sort((a, b) => a.distance_from_start - b.distance_from_start);
  const encodedPath = encodePolyline(pathPoints);
  const pathOverlay = `path-3+6C5CE7-0.6(${encodeURIComponent(encodedPath)})`;
  const pinOverlay = `pin-s+6C5CE7(${position.lng},${position.lat})`;

  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pathOverlay},${pinOverlay}/${position.lng},${position.lat},${zoom},0/640x300@2x?access_token=${token}`
    : null;

  return (
    <Link
      href={`/journey/${userJourneyId}/map`}
      className="mt-3.5 rounded-2xl border p-3.5 pb-3 relative block"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      {mapUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- Mapbox Static Images API, not an optimizable local asset
        <img src={mapUrl} alt="Map of your current position" className="w-full rounded-lg block" />
      ) : (
        <div
          className="w-full h-[150px] rounded-lg flex items-center justify-center text-xs"
          style={{ background: "#F0F1FA", color: "var(--color-text-secondary)" }}
        >
          Set NEXT_PUBLIC_MAPBOX_TOKEN to show the map
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Current location
        </span>
        <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {locationLabel}
        </span>
      </div>
    </Link>
  );
}
