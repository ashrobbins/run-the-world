import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { formatDistance } from "@/lib/units";

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
    .select("name, country_code, distance_from_start, description")
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

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: "linear-gradient(180deg, #7C6CF0 0%, #5A48D8 45%, #FFFFFF 45%)" }}
    >
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
          {formatDistance(checkpoint.distance_from_start, unit)} into your journey
        </div>
      </div>

      <div className="flex-1 bg-white mt-5 rounded-t-3xl p-6 flex flex-col">
        {checkpoint.description && (
          <div
            className="rounded-2xl p-3.5 border text-sm"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
          >
            {checkpoint.description}
          </div>
        )}

        <div className="flex-1" />

        <Link
          href={`/journey/${userJourneyId}`}
          className="w-full rounded-xl py-3.5 text-sm font-bold text-white text-center"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Continue journey
        </Link>
      </div>
    </div>
  );
}
