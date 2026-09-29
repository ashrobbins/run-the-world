import { BottomNav } from "@/components/nav/BottomNav";
import { AutoSync } from "@/components/strava/AutoSync";
import { getCurrentUser, getProfile, getStravaConnection } from "@/lib/supabase/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  let stravaConnected = false;
  let unit: "km" | "mi" = "km";

  if (user) {
    const [connection, profile] = await Promise.all([getStravaConnection(user.id), getProfile(user.id)]);
    stravaConnected = !!connection;
    unit = profile?.unit_preference ?? "km";
  }

  return (
    <div className="h-dvh flex flex-col max-w-md mx-auto" style={{ background: "var(--color-bg)" }}>
      {stravaConnected && <AutoSync unit={unit} />}
      <div className="flex-1 overflow-y-auto min-h-0 content-enter">{children}</div>
      <BottomNav />
    </div>
  );
}
