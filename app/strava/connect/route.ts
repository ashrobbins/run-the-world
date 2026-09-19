import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildStravaAuthorizeUrl } from "@/lib/strava/oauth";

/** Redirects the signed-in user to Strava's OAuth authorize page. */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // `state` round-trips through Strava so the callback knows which user initiated
  // this — Strava itself doesn't know about our session.
  const authorizeUrl = buildStravaAuthorizeUrl(user.id);
  return NextResponse.redirect(authorizeUrl);
}
