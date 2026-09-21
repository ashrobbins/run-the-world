import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { LandmarkIcon } from "@/components/journey/landmark-icons";
import { ShareCheckpointButton } from "@/components/journey/ShareCheckpointButton";
import { classifyCheckpoints } from "@/lib/journeys/progress";
import { formatDistance } from "@/lib/units";

const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  uk: "UK",
  usa: "USA",
  uae: "UAE",
};

function countryName(code: string): string {
  return COUNTRY_NAME_OVERRIDES[code] ?? code.charAt(0).toUpperCase() + code.slice(1);
}

export default async function CheckpointUnlockedPage({
  params,
  searchParams,
}: {
  params: Promise<{ userJourneyId: string }>;
  searchParams: Promise<{ checkpointId?: string }>;
}) {
  const { userJourneyId } = await params;
  const { checkpointId } = await searchParams;
  if (!checkpointId) notFound();

  const supabase = await createClient();
  const { data: checkpoint } = await supabase
    .from("checkpoints")
    .select("name, country_code, distance_from_start, unlock_content, journey_id, checkpoint_landmarks(name, icon_key, sequence_number)")
    .eq("id", checkpointId)
    .maybeSingle();

  if (!checkpoint) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("unit_preference").eq("id", user.id).maybeSingle()
    : { data: null };
  const unit = profile?.unit_preference ?? "km";

  const { data: userJourney } = await supabase
    .from("user_journeys")
    .select("distance_completed, journeys(total_distance)")
    .eq("id", userJourneyId)
    .maybeSingle();
  const journey = userJourney ? (Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys) : null;

  const { data: allCheckpoints } = await supabase
    .from("checkpoints")
    .select("id, name, distance_from_start")
    .eq("journey_id", checkpoint.journey_id)
    .order("sequence_number", { ascending: true });

  const progressPercent =
    userJourney && journey ? ((userJourney.distance_completed / journey.total_distance) * 100).toFixed(1) : null;
  const nextCheckpoint =
    userJourney && allCheckpoints
      ? classifyCheckpoints(allCheckpoints, userJourney.distance_completed).find((c) => c.state === "next")
      : undefined;

  const landmarks = [...(checkpoint.checkpoint_landmarks ?? [])].sort((a, b) => a.sequence_number - b.sequence_number);

  return (
    <div
      className="flex flex-col min-h-full relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #7C6CF0 0%, #5A48D8 45%, #FFFFFF 45%)" }}
    >
      <Link href={`/journey/${userJourneyId}`} aria-label="Close" className="absolute top-4 left-4 z-10">
        <CloseIcon />
      </Link>

      <div className="text-center pt-8">
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.85)" }}>
          Checkpoint unlocked
        </span>
      </div>

      <div className="flex justify-center mt-4">
        <CheckpointMarker countryCode={checkpoint.country_code} state="reached" size={128} />
      </div>

      <div className="text-center mt-4">
        <div className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          {checkpoint.name}
        </div>
        <div className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
          {countryName(checkpoint.country_code)} &middot; {formatDistance(checkpoint.distance_from_start, unit)} into your journey
        </div>
      </div>

      <div className="flex-1 bg-white mt-5 rounded-t-3xl p-6 flex flex-col">
        {landmarks.length > 0 && (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              Landmarks here
            </div>
            <div className="flex flex-row gap-3 mt-2 overflow-x-auto pb-1">
              {landmarks.map((landmark, i) => (
                <div key={landmark.name} className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: 76 }}>
                  <LandmarkIcon iconKey={landmark.icon_key} index={i} size={68} />
                  <span className="text-[11px] font-semibold text-center" style={{ color: "var(--color-text-primary)" }}>
                    {landmark.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {checkpoint.unlock_content && (
          <div
            className="rounded-2xl p-3.5 border text-sm mt-3"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-secondary)" }}>
              Did you know?
            </div>
            {checkpoint.unlock_content}
          </div>
        )}

        <div className="flex flex-row gap-3 mt-3">
          {progressPercent && (
            <div className="flex-1 rounded-2xl p-3.5" style={{ background: "var(--color-card)" }}>
              <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
                Journey progress
              </div>
              <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                {progressPercent}%
              </div>
            </div>
          )}
          {nextCheckpoint && (
            <div className="flex-1 rounded-2xl p-3.5" style={{ background: "var(--color-card)" }}>
              <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
                Next checkpoint
              </div>
              <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                {nextCheckpoint.name}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <Link
          href={`/journey/${userJourneyId}`}
          className="w-full rounded-xl py-3.5 text-sm font-bold text-white text-center"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Continue journey
        </Link>

        <ShareCheckpointButton
          title={`Checkpoint unlocked: ${checkpoint.name}`}
          text={`I just reached ${checkpoint.name}, ${countryName(checkpoint.country_code)} on my Run the World journey!`}
        />
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
