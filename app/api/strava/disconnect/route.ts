import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidAccessToken, disconnectStravaAccount } from "@/lib/strava/oauth";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const accessToken = await getValidAccessToken(user.id);
    await disconnectStravaAccount(user.id, accessToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Disconnect failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
