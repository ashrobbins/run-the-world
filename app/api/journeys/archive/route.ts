import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { userJourneyId } = await request.json();
  if (typeof userJourneyId !== "string") {
    return NextResponse.json({ error: "Missing userJourneyId." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: userJourney } = await supabase
    .from("user_journeys")
    .select("id, status, distance_completed, journeys(total_distance)")
    .eq("id", userJourneyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!userJourney) {
    return NextResponse.json({ error: "Journey not found." }, { status: 404 });
  }

  const journey = Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys;
  const isRouteComplete = journey && userJourney.distance_completed >= journey.total_distance;
  if (userJourney.status !== "active" || !isRouteComplete) {
    return NextResponse.json({ error: "Only a completed journey can be archived." }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_journeys")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", userJourneyId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
