import { encodePolyline } from "@/lib/polyline";

interface LatLng {
  lat: number;
  lng: number;
}

interface Checkpoint extends LatLng {
  name: string;
  distance_from_start: number;
}

/** Naive linear interpolation between checkpoints — good enough until real route_geometry exists. */
function interpolatePosition(checkpoints: Checkpoint[], distanceCompleted: number): LatLng {
  const sorted = [...checkpoints].sort((a, b) => a.distance_from_start - b.distance_from_start);
  const nextIndex = sorted.findIndex((c) => c.distance_from_start > distanceCompleted);

  if (nextIndex <= 0) return sorted[0];
  if (nextIndex === -1) return sorted[sorted.length - 1];

  const prev = sorted[nextIndex - 1];
  const next = sorted[nextIndex];
  const span = next.distance_from_start - prev.distance_from_start;
  const t = span === 0 ? 0 : (distanceCompleted - prev.distance_from_start) / span;

  return {
    lat: prev.lat + (next.lat - prev.lat) * t,
    lng: prev.lng + (next.lng - prev.lng) * t,
  };
}

function nearestCheckpointKm(checkpoints: Checkpoint[], distanceCompleted: number): number {
  return Math.min(
    ...checkpoints.map((c) => Math.abs(c.distance_from_start - distanceCompleted)),
  );
}

const CITY_ZOOM_THRESHOLD_KM = 15;

export function MapCard({
  checkpoints,
  distanceCompleted,
  locationLabel,
}: {
  checkpoints: Checkpoint[];
  distanceCompleted: number;
  locationLabel: string;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const position = interpolatePosition(checkpoints, distanceCompleted);
  const isNearCity = nearestCheckpointKm(checkpoints, distanceCompleted) <= CITY_ZOOM_THRESHOLD_KM;
  const zoom = isNearCity ? 11 : 4;

  const sortedForPath = [...checkpoints].sort((a, b) => a.distance_from_start - b.distance_from_start);
  const encodedPath = encodePolyline(sortedForPath);
  const pathOverlay = `path-3+6C5CE7-0.6(${encodeURIComponent(encodedPath)})`;
  const pinOverlay = `pin-s+6C5CE7(${position.lng},${position.lat})`;

  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pathOverlay},${pinOverlay}/${position.lng},${position.lat},${zoom},0/640x300@2x?access_token=${token}`
    : null;

  return (
    <div
      className="mt-3.5 rounded-2xl border p-3.5 pb-3 relative"
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
    </div>
  );
}
