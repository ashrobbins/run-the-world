import type { FlagDefinition } from "./flags";

/** Builds an SVG `stop`-percentage pairing for N colors, evenly spaced unless `stops` given. */
function bandStops(colors: string[], stops?: number[]): Array<[string, number, number]> {
  const n = colors.length;
  const pts = stops ?? Array.from({ length: n + 1 }, (_, i) => Math.round((i * 100) / n));
  return colors.map((c, i) => [c, pts[i], pts[i + 1]]);
}

function DotEmblem({ color, top, left, size }: { color: string; top: number; left: number; size: number }) {
  return (
    <circle
      cx={`${left}%`}
      cy={`${top}%`}
      r={`${(size / 2) * 100}%`}
      fill={color}
    />
  );
}

function BespokeUK() {
  return (
    <g>
      <rect width="100" height="100" fill="#012169" />
      <path d="M0 0 L100 100 M100 0 L0 100" stroke="#FFFFFF" strokeWidth="20" />
      <path d="M0 0 L100 100 M100 0 L0 100" stroke="#C8102E" strokeWidth="9" />
      <path d="M50 0 V100 M0 50 H100" stroke="#FFFFFF" strokeWidth="26" />
      <path d="M50 0 V100 M0 50 H100" stroke="#C8102E" strokeWidth="13" />
    </g>
  );
}

function BespokeUSA() {
  const stripeHeight = 100 / 9;
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={0}
          y={i * stripeHeight}
          width={100}
          height={stripeHeight}
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      <rect x={0} y={0} width={46} height={55} fill="#3C3B6E" />
    </g>
  );
}

function BespokeTurkey() {
  return (
    <g>
      <rect width="100" height="100" fill="#E30A17" />
      <circle cx={35} cy={50} r={23} fill="#FFFFFF" />
      <circle cx={40} cy={50} r={20} fill="#E30A17" />
      <rect x={54} y={46} width={8} height={8} fill="#FFFFFF" transform="rotate(45 58 50)" />
    </g>
  );
}

function BespokeAustralia() {
  const stars = [
    { top: 58, left: 55, r: 4.5 },
    { top: 40, left: 68, r: 4 },
    { top: 62, left: 78, r: 4 },
    { top: 78, left: 68, r: 4 },
    { top: 20, left: 20, r: 5 },
  ];
  return (
    <g>
      <rect width="100" height="100" fill="#00247D" />
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.left}%`} cy={`${s.top}%`} r={s.r} fill="#FFFFFF" />
      ))}
    </g>
  );
}

function BespokeSingapore() {
  return (
    <g>
      <rect width="100" height="50" fill="#EF3340" />
      <rect y={50} width="100" height="50" fill="#FFFFFF" />
      <circle cx={26} cy={26} r={13} fill="#FFFFFF" />
      <circle cx={30} cy={26} r={12} fill="#EF3340" />
    </g>
  );
}

const BESPOKE: Record<string, () => React.ReactElement> = {
  uk: BespokeUK,
  usa: BespokeUSA,
  turkey: BespokeTurkey,
  australia: BespokeAustralia,
  singapore: BespokeSingapore,
};

/**
 * Renders the flag fill for a 100x100 viewBox circle (the caller clips to a circle).
 * Pure presentational logic — no knowledge of "reached/next/locked" state, which is
 * layered on by CheckpointMarker.
 */
export function renderFlagFill(def: FlagDefinition): React.ReactElement {
  switch (def.kind) {
    case "bespoke":
      return BESPOKE[def.render]();

    case "bands-horizontal":
      return (
        <g>
          {bandStops(def.colors, def.stops).map(([color, from, to], i) => (
            <rect key={i} x={0} y={`${from}%`} width={100} height={`${to - from}%`} fill={color} />
          ))}
          {def.dot && <DotEmblem {...def.dot} />}
        </g>
      );

    case "bands-vertical":
      return (
        <g>
          {bandStops(def.colors, def.stops).map(([color, from, to], i) => (
            <rect key={i} x={`${from}%`} y={0} width={`${to - from}%`} height={100} fill={color} />
          ))}
          {def.dot && <DotEmblem {...def.dot} />}
        </g>
      );

    case "cross":
      return (
        <g>
          <rect width="100" height="100" fill={def.background} />
          <rect x="38" y="0" width="22" height="100" fill={def.cross} />
          <rect x="0" y="38" width="100" height="22" fill={def.cross} />
          {def.inner && (
            <>
              <rect x="42" y="0" width="12" height="100" fill={def.inner} />
              <rect x="0" y="42" width="100" height="12" fill={def.inner} />
            </>
          )}
        </g>
      );
  }
}
