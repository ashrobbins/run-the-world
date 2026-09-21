/**
 * Small set of generic line-art landmark icons — like flags.ts/flag-renderer.tsx,
 * this is deliberately not a per-landmark custom-art system. `icon_key` on
 * checkpoint_landmarks picks one of these categories; unrecognized keys fall back
 * to the generic "monument" icon.
 */

export type LandmarkIconKey =
  | "tower"
  | "arch"
  | "pyramid"
  | "cathedral"
  | "bridge"
  | "mountain"
  | "castle"
  | "statue"
  | "gate"
  | "monument";

const ICON_PATHS: Record<LandmarkIconKey, string[]> = {
  tower: ["M12 2L6 22M12 2L18 22", "M8 14H16", "M9.5 8H14.5"],
  arch: ["M5 22V10a7 7 0 0114 0v12", "M5 22H19", "M9 22V14a3 3 0 016 0v8"],
  pyramid: ["M12 4L21 20H3Z", "M7 20L12 12L17 20"],
  cathedral: ["M6 22V10L9 4L12 10V22", "M18 22V10L15 4L12 10", "M4 22H20"],
  bridge: ["M2 16C6 10 18 10 22 16", "M2 20H22", "M6 16V20", "M12 13V20", "M18 16V20"],
  mountain: ["M2 20L9 8L13 14L16 10L22 20Z"],
  castle: ["M4 22V10H8V6H10V10H14V6H16V10H20V22Z", "M4 22H20"],
  statue: ["M12 3a2 2 0 100 4 2 2 0 000-4", "M9 21V13a3 3 0 016 0v8", "M8 21H16"],
  gate: ["M3 8H21", "M3 5H21", "M6 5V21", "M18 5V21"],
  monument: ["M10 22V6L12 2L14 6V22Z"],
};

// Cycled by index, same pattern as the Journey Library route-shape tiles.
const TILE_BACKGROUNDS = ["#E1EFFF", "#F3E8FF", "#FDF1DC", "#E1F3EE"];

export function LandmarkIcon({
  iconKey,
  index = 0,
  size = 64,
}: {
  iconKey: string;
  index?: number;
  size?: number;
}) {
  const key = (iconKey in ICON_PATHS ? iconKey : "monument") as LandmarkIconKey;
  const background = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];

  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke="#12203D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[key].map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  );
}
