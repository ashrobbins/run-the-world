import Link from "next/link";
import { redirect } from "next/navigation";
import { generateRouteOptions, type RoutePoint } from "@/lib/journeys/route-generator";
import { chooseRouteOption } from "@/lib/journeys/actions";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";

interface OptionsSearchParams {
  fromName?: string;
  fromLat?: string;
  fromLng?: string;
  fromCountry?: string;
  toName?: string;
  toLat?: string;
  toLng?: string;
  toCountry?: string;
}

export default async function RouteOptionsPage({
  searchParams,
}: {
  searchParams: Promise<OptionsSearchParams>;
}) {
  const params = await searchParams;
  if (!params.fromLat || !params.fromLng || !params.toLat || !params.toLng) {
    redirect("/journey/new/custom");
  }

  const start: RoutePoint = {
    name: params.fromName!,
    countryCode: params.fromCountry ?? "uk",
    lat: Number(params.fromLat),
    lng: Number(params.fromLng),
  };
  const end: RoutePoint = {
    name: params.toName!,
    countryCode: params.toCountry ?? "uk",
    lat: Number(params.toLat),
    lng: Number(params.toLng),
  };

  const options = generateRouteOptions(start, end);

  return (
    <div className="px-6 pt-5 pb-6 flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-1">
        <Link href="/journey/new/custom" aria-label="Back">
          <BackIcon />
        </Link>
        <div className="text-center">
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            Choose your route
          </div>
          <div className="text-[11px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            {start.name} &rarr; {end.name}
          </div>
        </div>
        <span className="w-5" />
      </div>

      <div className="flex-1 flex flex-col gap-3.5 mt-4">
        {options.map((option, index) => (
          <form key={option.name} action={chooseRouteOption}>
            <input type="hidden" name="route" value={JSON.stringify(option.waypoints)} />
            <button
              type="submit"
              className="w-full text-left rounded-2xl p-4"
              style={{
                border: index === 0 ? "2px solid var(--color-accent)" : "1.5px solid var(--color-border)",
                background: index === 0 ? "#F9F8FE" : "transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                  {option.name}
                </span>
                {option.badge && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: option.badge === "Shortest" ? "#1B8A4E" : "var(--color-accent)",
                      background: option.badge === "Shortest" ? "#E8F8EF" : "var(--color-accent-light)",
                    }}
                  >
                    {option.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-row items-center gap-2.5 mt-3.5 overflow-x-auto pb-1">
                {option.waypoints.map((point, i) => (
                  <div key={`${point.name}-${i}`} className="shrink-0">
                    <CheckpointMarker countryCode={point.countryCode} state="preview" label={point.name} size={34} />
                  </div>
                ))}
              </div>

              <div className="flex flex-row gap-4 mt-3.5 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
                    Distance
                  </div>
                  <div className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {Math.round(option.totalDistanceKm).toLocaleString()} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
                    Checkpoints
                  </div>
                  <div className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {option.waypoints.length}
                  </div>
                </div>
              </div>
            </button>
          </form>
        ))}
      </div>
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
