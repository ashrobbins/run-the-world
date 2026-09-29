/** The bare mark with no background tile — for placing directly on an already-colored
 * surface (e.g. the splash screen), where LogoMark's own tile would look redundant. */
export function LogoGlyph({ size = 52, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="17" stroke={color} strokeWidth="2.4" />
      <path d="M12 22 C 20 16, 32 16, 40 22" stroke={color} strokeWidth="1.6" opacity="0.5" fill="none" />
      <path d="M12 31 C 20 37, 32 37, 40 31" stroke={color} strokeWidth="1.6" opacity="0.5" fill="none" />
      <path d="M15 12 C 17 22, 17 30, 15 40" stroke={color} strokeWidth="1.6" opacity="0.5" fill="none" />
      <path
        d="M13 30 C 18 22, 26 18, 36 20"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="0.5 6"
        fill="none"
      />
      <circle cx="13" cy="30" r="3" fill={color} />
      <circle cx="36" cy="20" r="3" fill={color} />
    </svg>
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(160deg, #7C6CF0 0%, #5A48D8 100%)",
      }}
    >
      <LogoGlyph size={size * 0.68} />
    </div>
  );
}

export function LogoLockup({ markSize = 44, textSize = "text-xl" }: { markSize?: number; textSize?: string }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <LogoMark size={markSize} />
      <span className={`font-bold ${textSize}`} style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
        Run the World
      </span>
    </div>
  );
}
