import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Exchanges the Supabase magic-link code for a session, then redirects into the app. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (!code) {
    // Supabase redirected here without a `code` — almost always means this URL
    // isn't on the project's Redirect URLs allow-list (Authentication -> URL
    // Configuration in the Supabase dashboard), so it fell back to the Site URL
    // instead of completing the PKCE flow.
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("No auth code received — check this URL is in Supabase's Redirect URLs allow-list.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
