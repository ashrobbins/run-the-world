import { FLAGS, type CountryCode } from "./flags";
import { renderFlagFill } from "./flag-renderer";

export type CheckpointMarkerState = "reached" | "next" | "locked" | "preview";

interface CheckpointMarkerProps {
  countryCode: CountryCode | string;
  state: CheckpointMarkerState;
  label?: string;
  size?: number;
}

const CLIP_ID_PREFIX = "checkpoint-marker-clip";

export function CheckpointMarker({
  countryCode,
  state,
  label,
  size = 44,
}: CheckpointMarkerProps) {
  const def = FLAGS[countryCode] ?? FLAGS.uk;
  const isLocked = state === "locked";
  const isNext = state === "next";
  const isGrey = isLocked || isNext;
  const clipId = `${CLIP_ID_PREFIX}-${countryCode}-${state}`;

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            border: isLocked ? "2px dashed #E4E3F3" : "2.5px solid #6C5CE7",
            opacity: isLocked ? 0.45 : isNext ? 0.8 : 1,
            filter: isGrey ? "grayscale(1)" : "none",
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <clipPath id={clipId}>
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>{renderFlagFill(def)}</g>
          </svg>
        </div>

        {state === "reached" && (
          <StatusBadge color="#6C5CE7">
            <path d="M20 6L9 17l-5-5" fill="none" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </StatusBadge>
        )}
        {state === "next" && (
          <StatusBadge color="#8B93A7">
            <path
              d="M6 3h12M6 21h12M8 3c0 5 8 5 8 8s-8 3-8 8M16 3c0 5-8 5-8 8s8 3 8 8"
              fill="none"
              stroke="#8B93A7"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </StatusBadge>
        )}
      </div>
      {label && (
        <span
          className="text-[10px] font-semibold whitespace-nowrap"
          style={{ color: isLocked ? "#B4B4CE" : "#12203D" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full bg-white"
      style={{
        bottom: -2,
        right: -2,
        width: "42%",
        height: "42%",
        minWidth: 16,
        minHeight: 16,
        border: `2px solid ${color}`,
      }}
    >
      <svg viewBox="0 0 24 24" width="55%" height="55%">
        {children}
      </svg>
    </div>
  );
}
