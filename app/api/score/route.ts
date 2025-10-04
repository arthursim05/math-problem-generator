import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // use service key for inserts
);

export async function GET() {
  try {
    const { data: submissions, error } = await supabase
    .from("math_problem_submissions")
    .select("is_correct")
    .order("created_at", { ascending: true });

    if (error){
        return NextResponse.json({ error: "Error fetching score" }, { status: 500 });
    };

    let attempts = submissions.length;
    let corrects = submissions.filter((s) => s.is_correct).length;

    let streak = 0;
    for (let i = submissions.length - 1; i >= 0; i--) {
        if (submissions[i].is_correct) {
            streak++;
        } else {
            break;
        }
    }

    let bestStreak = 0;
    let tempStreak = 0;
    for (const s of submissions) {
        if (s.is_correct) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    return NextResponse.json({
      attempts,
      corrects,
      streak,
      bestStreak,   
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Error fetching score" }, { status: 500 });
  }
}
