export function LinkWithStravaCta() {
  return (
    <div
      className="w-full rounded-2xl p-4 border"
      style={{ background: "#FFF6F0", borderColor: "#FBDCC4" }}
    >
      <a
        href="/strava/connect"
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 border"
        style={{ background: "#FDECE0", borderColor: "#F7C79E" }}
      >
        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "#B24E12" }}>
          Link with Strava
        </span>
      </a>
      <p className="text-xs mt-2" style={{ color: "#A9835F" }}>
        We only import running activities to track your journey progress.
      </p>
    </div>
  );
}
