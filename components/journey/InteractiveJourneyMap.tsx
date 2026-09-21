"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { interpolatePosition, splitLineAtFraction, type CheckpointLike } from "@/lib/journeys/map-position";

interface Checkpoint extends CheckpointLike {
  id: string;
  name: string;
}

function lineFeature(points: { lat: number; lng: number }[]) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: points.map((p) => [p.lng, p.lat] as [number, number]),
    },
  };
}

export function InteractiveJourneyMap({
  userJourneyId,
  routeLabel,
  checkpoints,
  distanceCompleted,
  totalDistance,
  routeGeometry,
  currentLocationLabel,
  nextCheckpoint,
  focusCheckpoint,
}: {
  userJourneyId: string;
  routeLabel: string;
  checkpoints: Checkpoint[];
  distanceCompleted: number;
  totalDistance: number;
  routeGeometry?: { coordinates: [number, number][] } | null;
  currentLocationLabel: string;
  nextCheckpoint: { name: string; distanceAwayLabel: string } | null;
  focusCheckpoint?: { lat: number; lng: number; name: string } | null;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  const position = interpolatePosition(checkpoints, distanceCompleted);
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a.distance_from_start - b.distance_from_start);
  const pathPoints = routeGeometry?.coordinates.length
    ? routeGeometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
    : sortedCheckpoints;

  const fraction = totalDistance > 0 ? distanceCompleted / totalDistance : 0;
  const { traveled, remaining } = splitLineAtFraction(pathPoints, fraction);
  const nextCheckpointPoint = nextCheckpoint
    ? sortedCheckpoints.find((c) => c.name === nextCheckpoint.name)
    : undefined;

  useEffect(() => {
    if (!token || !containerRef.current) return;

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: focusCheckpoint ? [focusCheckpoint.lng, focusCheckpoint.lat] : [position.lng, position.lat],
        zoom: focusCheckpoint ? 10 : 5,
      });
      mapRef.current = map;

      map.on("load", () => {
        map.addSource("traveled", { type: "geojson", data: lineFeature(traveled) });
        map.addLayer({
          id: "traveled",
          type: "line",
          source: "traveled",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#6C5CE7", "line-width": 4 },
        });

        map.addSource("remaining", { type: "geojson", data: lineFeature(remaining) });
        map.addLayer({
          id: "remaining",
          type: "line",
          source: "remaining",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#8B93A7", "line-width": 3, "line-opacity": 0.5, "line-dasharray": [2, 2] },
        });

        new mapboxgl.Marker({ color: "#6C5CE7" }).setLngLat([position.lng, position.lat]).addTo(map);

        if (nextCheckpointPoint) {
          new mapboxgl.Marker({ color: "#FFFFFF" })
            .setLngLat([nextCheckpointPoint.lng, nextCheckpointPoint.lat])
            .addTo(map);
        }

        if (focusCheckpoint) {
          new mapboxgl.Marker({ color: "#E87A4C" })
            .setLngLat([focusCheckpoint.lng, focusCheckpoint.lat])
            .setPopup(new mapboxgl.Popup({ offset: 24, closeButton: false }).setText(focusCheckpoint.name))
            .addTo(map)
            .togglePopup();
        }
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Map is built once from the journey's current snapshot — it doesn't need to
    // react to prop changes after that (this screen is opened fresh each time).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="fixed inset-0 z-40" style={{ background: "var(--color-bg)" }}>
      {token ? (
        // Mapbox GL sets `position: relative` on the element it's given (via its own
        // CSS), which clobbers Tailwind's `absolute inset-0` if that's on the same
        // node. Keep positioning on this wrapper and give the actual map container
        // its size via w-full/h-full instead, which works regardless of `position`.
        <div className="absolute inset-0">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ background: "#F0F1FA", color: "var(--color-text-secondary)" }}>
          Set NEXT_PUBLIC_MAPBOX_TOKEN to show the map
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
        <Link
          href={`/journey/${userJourneyId}`}
          aria-label="Close"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-bg)" }}
        >
          <CloseIcon />
        </Link>
        <div
          className="rounded-full px-4 py-2 text-xs font-bold"
          style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
        >
          {routeLabel}
        </div>
        <span className="w-9 h-9" />
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col rounded-xl overflow-hidden shadow-lg">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-9 h-9 flex items-center justify-center text-lg font-bold"
          style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
          aria-label="Zoom in"
        >
          +
        </button>
        <div className="h-px" style={{ background: "var(--color-border)" }} />
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-9 h-9 flex items-center justify-center text-lg font-bold"
          style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
          aria-label="Zoom out"
        >
          &minus;
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4 rounded-t-2xl"
        style={{ background: "var(--color-bg)" }}
      >
        <div>
          <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
            Current location
          </div>
          <div className="text-sm font-bold mt-0.5" style={{ color: "var(--color-text-primary)" }}>
            {currentLocationLabel}
          </div>
        </div>
        {nextCheckpoint && (
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
              Next
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ color: "var(--color-accent)" }}>
              {nextCheckpoint.name} &middot; {nextCheckpoint.distanceAwayLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
