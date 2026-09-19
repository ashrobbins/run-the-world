import { createClient } from "@/lib/supabase/server";
import { LinkWithStravaCta } from "@/components/strava/LinkWithStravaCta";
import { DisconnectStravaButton, SyncNowInline, UnitToggle, DeleteAccountButton } from "@/components/profile/ProfileActions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: connection } = await supabase
    .from("strava_connections")
    .select("strava_athlete_id, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_preference")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="px-6 pt-6 pb-6">
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
        Profile
      </h1>
      <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
        {user.email}
      </p>

      <div className="mt-5">
        {connection ? (
          <div className="rounded-2xl border p-4" style={{ background: "#FFF6F2", borderColor: "#FCE4D8" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                  Strava
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
                  <span className="text-xs font-semibold" style={{ color: "#1B8A4E" }}>
                    Connected (athlete #{connection.strava_athlete_id})
                  </span>
                </div>
              </div>
              <DisconnectStravaButton />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#FCE4D8" }}>
              <span className="text-xs" style={{ color: "#8B7166" }}>
                Last synced {new Date(connection.updated_at).toLocaleTimeString()}
              </span>
              <SyncNowInline />
            </div>
          </div>
        ) : (
          <LinkWithStravaCta />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <UnitToggle unit={profile?.unit_preference ?? "km"} />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
