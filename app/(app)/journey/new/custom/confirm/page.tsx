import Link from "next/link";

interface ConfirmSearchParams {
  fromName?: string;
  fromLat?: string;
  fromLng?: string;
  fromCountry?: string;
  toName?: string;
  toLat?: string;
  toLng?: string;
  toCountry?: string;
}

const START_COLOR = "1B8A4E";
const DEST_COLOR = "6C5CE7";

export default async function ConfirmDestinationPage({
  searchParams,
}: {
  searchParams: Promise<ConfirmSearchParams>;
}) {
  const params = await searchParams;
  const { fromName, fromLat, fromLng, toName, toLat, toLng } = params;

  if (!fromName || !fromLat || !fromLng || !toName || !toLat || !toLng) {
    return (
      <div className="px-6 pt-5 pb-6">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Missing route details.
        </p>
        <Link href="/journey/new/custom" className="text-sm font-semibold mt-3 inline-block" style={{ color: "var(--color-accent)" }}>
          Start over
        </Link>
      </div>
    );
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const startPin = `pin-s-a+${START_COLOR}(${fromLng},${fromLat})`;
  const destPin = `pin-s-b+${DEST_COLOR}(${toLng},${toLat})`;
  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${startPin},${destPin}/auto/640x400@2x?padding=60&access_token=${token}`
    : null;

  const optionsParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );

  return (
    <div className="px-6 pt-5 pb-6 flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-1">
        <Link href="/journey/new/custom" aria-label="Back">
          <BackIcon />
        </Link>
        <div className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Does this look right?
        </div>
        <span className="w-5" />
      </div>

      <div className="rounded-2xl border mt-4 overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        {mapUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Mapbox Static Images API, not an optimizable local asset
          <img src={mapUrl} alt={`Map from ${fromName} to ${toName}`} className="w-full block" />
        ) : (
          <div
            className="w-full h-[220px] flex items-center justify-center text-xs"
            style={{ background: "#F0F1FA", color: "var(--color-text-secondary)" }}
          >
            Set NEXT_PUBLIC_MAPBOX_TOKEN to show the map
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 mt-4">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: `#${START_COLOR}` }} />
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {fromName}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: `#${DEST_COLOR}` }} />
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {toName}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <Link
        href={`/journey/new/custom/options?${optionsParams.toString()}`}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white text-center mt-4"
        style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
      >
        Looks good, find routes
      </Link>
      <Link href="/journey/new/custom" className="text-center text-xs font-semibold mt-3" style={{ color: "var(--color-text-secondary)" }}>
        Try again
      </Link>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
