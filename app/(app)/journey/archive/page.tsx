import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/supabase/session";
import { formatDistance, type UnitPreference } from "@/lib/units";

export default async function JourneyArchivePage() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const [profile, { data: userJourneys }] = await Promise.all([
    getProfile(user.id),
    supabase
      .from("user_journeys")
      .select(
        "id, distance_completed, completed_at, journeys(name, total_distance, start_name, destination_name)",
      )
      .eq("user_id", user.id)
      .neq("status", "active")
      .order("completed_at", { ascending: false }),
  ]);
  const unit: UnitPreference = profile?.unit_preference ?? "km";

  const cards = (userJourneys ?? []).map((uj) => {
    const journey = Array.isArray(uj.journeys) ? uj.journeys[0] : uj.journeys;
    const routeLabel = `${journey.start_name} → ${journey.destination_name}`;
    return {
      userJourneyId: uj.id,
      name: journey.name,
      routeLabel: journey.name === routeLabel ? null : routeLabel,
      distanceCompleted: uj.distance_completed,
      totalDistance: journey.total_distance,
      completedAt: uj.completed_at as string | null,
    };
  });

  return (
    <div className="px-6 pt-5 pb-6">
      <div className="flex items-center gap-3">
        <Link href="/home" aria-label="Back">
          <BackIcon />
        </Link>
        <h1
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Journey archive
        </h1>
      </div>

      {cards.length === 0 ? (
        <p className="text-sm mt-6" style={{ color: "var(--color-text-secondary)" }}>
          Journeys you archive will show up here, with their stamps kept safe in your Passport.
        </p>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {cards.map((card) => {
            const percent = ((card.distanceCompleted / card.totalDistance) * 100).toFixed(1);
            const formattedDate = card.completedAt
              ? new Date(card.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : null;
            return (
              <Link
                key={card.userJourneyId}
                href={`/journey/${card.userJourneyId}`}
                className="block rounded-2xl p-4 border"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                      {card.name}
                    </div>
                    {card.routeLabel && (
                      <div className="text-xs font-medium mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        {card.routeLabel}
                      </div>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full shrink-0 ml-2"
                    style={{ color: "var(--color-text-secondary)", background: "var(--color-border)" }}
                  >
                    {percent}%
                  </span>
                </div>
                <div className="text-xs font-semibold mt-2" style={{ color: "var(--color-text-secondary)" }}>
                  {formatDistance(card.distanceCompleted, unit)} / {formatDistance(card.totalDistance, unit)}
                  {formattedDate && ` · Archived ${formattedDate}`}
                </div>
              </Link>
            );
          })}
        </div>
      )}
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
