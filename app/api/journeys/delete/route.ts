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
    .select("id, journey_id, journeys(journey_type, created_by)")
    .eq("id", userJourneyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!userJourney) {
    return NextResponse.json({ error: "Journey not found." }, { status: 404 });
  }

  const journey = Array.isArray(userJourney.journeys) ? userJourney.journeys[0] : userJourney.journeys;

  // Custom journeys aren't shared with anyone else, so delete the journey itself
  // (checkpoints + this user_journeys row cascade via their FKs). Curated journeys
  // are shared across users, so only this user's progress on it is removed.
  const { error } =
    journey?.journey_type === "custom" && journey.created_by === user.id
      ? await supabase.from("journeys").delete().eq("id", userJourney.journey_id)
      : await supabase.from("user_journeys").delete().eq("id", userJourneyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
