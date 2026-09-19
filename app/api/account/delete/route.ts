import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Permanently deletes the signed-in user's account and every row that depends on it.
 * strava_connections, user_journeys, activities and profiles all cascade automatically
 * via `on delete cascade` foreign keys to auth.users (see migration 0001) — deleting
 * the auth user is the single source of truth for this action.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
