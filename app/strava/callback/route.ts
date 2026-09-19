import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { connectStravaAccount } from "@/lib/strava/oauth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error"); // e.g. "access_denied" if the user cancels

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !code || !user || state !== user.id) {
    return NextResponse.redirect(`${origin}/home`);
  }

  await connectStravaAccount(user.id, code);
  return NextResponse.redirect(`${origin}/home`);
}
