interface RoutePoint {
  lat: number;
  lng: number;
}

/**
 * A deliberately abstract, high-level rendering of a route's shape — projects real
 * lat/lng onto a small box and connects them with a dotted line. Not a map (no
 * basemap, no accurate projection) — just enough to hint at the route's geography.
 */
export function RouteShapeArt({
  points,
  className,
  strokeColor = "#6C5CE7",
  viewBoxWidth = 100,
  viewBoxHeight = 60,
  padding = 12,
}: {
  points: RoutePoint[];
  className?: string;
  strokeColor?: string;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  padding?: number;
}) {
  if (points.length < 2) return null;

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const latRange = Math.max(...lats) - Math.min(...lats) || 1;
  const lngRange = Math.max(...lngs) - Math.min(...lngs) || 1;
  const minLat = Math.min(...lats);
  const minLng = Math.min(...lngs);

  const innerW = viewBoxWidth - padding * 2;
  const innerH = viewBoxHeight - padding * 2;

  const projected = points.map((p) => ({
    x: padding + ((p.lng - minLng) / lngRange) * innerW,
    y: padding + (1 - (p.lat - minLat) / latRange) * innerH, // flip so north renders up
  }));

  const pathD = projected.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} strokeDasharray="0.5 4.5" strokeLinecap="round" opacity={0.85} />
      {projected.map((pt, i) => {
        const isEndpoint = i === 0 || i === projected.length - 1;
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={isEndpoint ? 3.2 : 1.8}
            fill={strokeColor}
            opacity={isEndpoint ? 1 : 0.55}
          />
        );
      })}
    </svg>
  );
}
