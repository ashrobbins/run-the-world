/** The passport-stamp-style badge used in the checkpoint quick-view modal — a
 * dashed circle with the checkpoint name as text, distinct from CheckpointMarker's
 * flag icon (used everywhere else: the row, the unlocked celebration screen). */
export function CheckpointStampBadge({ name, size = 112 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-center px-2"
      style={{
        width: size,
        height: size,
        border: "2px dashed #6C5CE7",
        background: "var(--color-accent-light)",
      }}
    >
      <span
        className="text-sm font-extrabold uppercase tracking-wide"
        style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
      >
        {name}
      </span>
    </div>
  );
}
