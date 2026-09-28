import { BottomNav } from "@/components/nav/BottomNav";
import { AutoSync } from "@/components/strava/AutoSync";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let stravaConnected = false;
  let unit: "km" | "mi" = "km";

  if (user) {
    const [{ data: connection }, { data: profile }] = await Promise.all([
      supabase.from("strava_connections").select("id").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("unit_preference").eq("id", user.id).maybeSingle(),
    ]);
    stravaConnected = !!connection;
    unit = profile?.unit_preference ?? "km";
  }

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto" style={{ background: "var(--color-bg)" }}>
      {stravaConnected && <AutoSync unit={unit} />}
      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      <BottomNav />
    </div>
  );
}
