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
    .select("id, user_answer, is_correct, feedback_text, created_at")
    .order("created_at", { ascending: true });

    if (error){
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    };

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
